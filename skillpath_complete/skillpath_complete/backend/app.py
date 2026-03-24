"""
SkillPath — AI-Adaptive Onboarding Engine
Flask Backend Server

Routes:
  POST /api/analyze          → Resume + JD → full analysis (Next.js frontend calls this)
  POST /api/diagnostic/generate  → JD → MCQ quiz
  POST /api/diagnostic/analyze   → Quiz answers → pathway
  GET  /api/health               → Health check
"""

import os
import traceback
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from dotenv import load_dotenv

from parser import extract_text_from_file
from analyzer import (
    run_full_analysis,
    generate_diagnostic_quiz,
    analyze_diagnostic_results
)

load_dotenv()

app = Flask(__name__)

CORS(app)

USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "false").lower() == "true"


# ── Response Transformer ──────────────────────────────────────────────────────
def transform_to_frontend_format(raw_result: dict) -> dict:
    resume  = raw_result.get("resume", {})
    pathway = raw_result.get("pathway", {})

    # skills_analysis
    skills_raw = pathway.get("skills_analysis", [])
    if not skills_raw:
        skills_raw = (
            [{"skill": s, "status": "present",  "candidate_level": "intermediate"}
             for s in pathway.get("skills_present", [])] +
            [{"skill": s, "status": "partial",  "candidate_level": "beginner"}
             for s in pathway.get("skills_partial",  [])] +
            [{"skill": s, "status": "missing",  "candidate_level": "none"}
             for s in pathway.get("skills_missing",  [])]
        )

    skills_analysis = []
    for s in skills_raw:
        evidence = ""
        for rs in resume.get("skills", []):
            if rs.get("skill","").lower() == s.get("skill","").lower():
                evidence = rs.get("evidence", "")
                break
        skills_analysis.append({
            "skill":    s.get("skill", ""),
            "status":   s.get("status", "missing"),
            "evidence": evidence or s.get("status", "missing")
        })

    # pathway courses
    total_days_saved = int(pathway.get("time_saved_days", 0))
    pathway_list = pathway.get("pathway", [])
    per_course = max(1, total_days_saved // max(len(pathway_list), 1))

    courses = []
    for step in pathway_list:
        courses.append({
            "title":     step.get("course_title", step.get("title", "")),
            "domain":    step.get("domain", "technical"),
            "level":     step.get("level", "beginner"),
            "duration":  step.get("duration", "1 day"),
            "reasoning": step.get("reasoning", ""),
            "days_saved": per_course
        })

    # reasoning_trace
    rt = pathway.get("reasoning_trace", {})
    conf_raw = rt.get("confidence", "medium")
    if isinstance(conf_raw, str):
        conf_map = {"high": 0.9, "medium": 0.6, "low": 0.3}
        confidence = conf_map.get(conf_raw.lower(), 0.6)
    else:
        try:
            confidence = float(conf_raw)
        except Exception:
            confidence = 0.6

    reasoning_trace = {
        "approach":         rt.get("approach", "Adaptive sequencing"),
        "skipped_courses":  rt.get("skipped_courses", []),
        "confidence":       confidence,
        "total_days_saved": total_days_saved
    }

    # candidate_summary
    candidate_summary = {
        "name":             resume.get("name", "Candidate"),
        "experience_years": str(resume.get("experience_years", 0)),
        "domains":          resume.get("domains", [])
    }

    return {
        "readiness_score":   int(pathway.get("readiness_score", 0)),
        "skills_analysis":   skills_analysis,
        "pathway":           courses,
        "reasoning_trace":   reasoning_trace,
        "candidate_summary": candidate_summary
    }


# ── Health Check ──────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    from analyzer import get_client
    try:
        get_client()
        api_status = "ok"
    except Exception:
        api_status = "api_key_missing"
    return jsonify({
        "status":    "ok",
        "api":       api_status,
        "mock_mode": USE_MOCK_DATA,
        "service":   "SkillPath",
        "version":   "2.1.0"
    })


# ── Main Analyze Endpoint ─────────────────────────────────────────────────────
@app.route("/api/analyze", methods=["POST", "OPTIONS"])
def analyze():
    """
    POST /api/analyze
    Form fields: resume (file), jdText (string)  ← Next.js sends 'jdText' not 'jd_text'
    Returns: AnalysisResponse matching lib/types.ts
    """
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        resume_file = request.files.get("resume")
        # Next.js frontend sends 'jdText' — support both jdText and jd_text
        jd_text = (
            request.form.get("jdText") or
            request.form.get("jd_text") or
            ""
        ).strip()
        is_mock = request.form.get("mock", "false").lower() == "true" or USE_MOCK_DATA

        # Validate
        if not resume_file or not resume_file.filename:
            return jsonify({"error": "Resume file is required."}), 400
        if not jd_text:
            return jsonify({"error": "Job description is required."}), 400
        if len(jd_text) < 30:
            return jsonify({"error": "Job description is too short."}), 400

        # Extract text from resume
        try:
            resume_text = extract_text_from_file(resume_file)
        except Exception as e:
            return jsonify({"error": f"Could not read resume: {str(e)}"}), 400

        if len(resume_text.strip()) < 50:
            return jsonify({"error": "Resume appears empty or unreadable."}), 400

        # Run full analysis pipeline
        metadata = {"filename": resume_file.filename}
        try:
            raw_result = run_full_analysis(
                resume_text, jd_text,
                resume_metadata=metadata,
                use_mock=is_mock
            )
        except Exception as e:
            err = str(e).lower()
            if not is_mock and (
                "credit balance is too low" in err
                or "authentication_error" in err
                or "invalid x-api-key" in err
            ):
                print("ANALYZE FALLBACK: switching to mock due to upstream API error")
                raw_result = run_full_analysis(
                    resume_text, jd_text,
                    resume_metadata=metadata,
                    use_mock=True
                )
            else:
                raise

        # If live Claude returns structured error payload, also fall back.
        if not raw_result.get("success") and not is_mock:
            err = str(raw_result.get("error", "")).lower()
            if (
                "credit balance is too low" in err
                or "authentication_error" in err
                or "invalid x-api-key" in err
            ):
                print("ANALYZE FALLBACK: switching to mock due to upstream API error payload")
                raw_result = run_full_analysis(
                    resume_text, jd_text,
                    resume_metadata=metadata,
                    use_mock=True
                )

        if not raw_result.get("success"):
            return jsonify({"error": raw_result.get("error", "Analysis failed.")}), 500

        # Transform to frontend format
        frontend_response = transform_to_frontend_format(raw_result)
        return jsonify(frontend_response)

    except EnvironmentError as e:
        print("ENV ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print("ANALYZE ERROR FULL:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


# ── Diagnostic: Generate Quiz ─────────────────────────────────────────────────
@app.route("/api/diagnostic/generate", methods=["POST", "OPTIONS"])
def diagnostic_generate():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        body = request.get_json(force=True) or {}
        jd_text = body.get("jd_text", body.get("jdText", "")).strip()
        is_mock = body.get("mock", False) or USE_MOCK_DATA

        if not jd_text or len(jd_text) < 30:
            return jsonify({"error": "Job description required."}), 400

        quiz_data = generate_diagnostic_quiz(jd_text, use_mock=is_mock)
        return jsonify({
            "success":    True,
            "questions":  quiz_data.get("questions", []),
            "role_title": quiz_data.get("role_title", "Target Role"),
            "jd_text":    jd_text
        })
    except Exception as e:
        print("DIAG GEN ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


# ── Diagnostic: Analyze Answers → Pathway ────────────────────────────────────
@app.route("/api/diagnostic/analyze", methods=["POST", "OPTIONS"])
def diagnostic_analyze():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        body = request.get_json(force=True) or {}
        jd_text    = body.get("jd_text", body.get("jdText", "")).strip()
        answers    = body.get("answers", [])
        role_title = body.get("role_title", "")
        is_mock    = body.get("mock", False) or USE_MOCK_DATA

        if not jd_text or not answers:
            return jsonify({"error": "Missing required fields."}), 400

        raw_result = analyze_diagnostic_results(
            jd_text, answers, role_title, use_mock=is_mock
        )
        frontend_response = transform_to_frontend_format(raw_result)
        return jsonify(frontend_response)
    except Exception as e:
        print("DIAG ANALYZE ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


# ── PPT Export ────────────────────────────────────────────────────────────────
@app.route("/api/export/pptx", methods=["POST", "OPTIONS"])
def export_pptx():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        from export_pptx import build_pptx
        data = request.get_json(force=True) or {}
        pptx_bytes = build_pptx(data)
        name = data.get("resume", {}).get("name", "candidate")
        name = name.lower().replace(" ", "-")
        return Response(
            pptx_bytes,
            mimetype="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={
                "Content-Disposition": f"attachment; filename=skillpath-{name}.pptx",
                "Content-Length": len(pptx_bytes)
            }
        )
    except Exception as e:
        print("EXPORT ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


# ── Entry Point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"\n SkillPath Backend — http://localhost:{port}")
    print(f"   ANTHROPIC_API_KEY : {'SET' if os.getenv('ANTHROPIC_API_KEY') else 'NOT SET — check .env'}")
    print(f"   MOCK MODE         : {USE_MOCK_DATA}")
    print("   CORS              : all origins (flask-cors)\n")
    app.run(debug=False, host="0.0.0.0", port=port)
