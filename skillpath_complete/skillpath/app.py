"""
SkillPath — AI-Adaptive Onboarding Engine
Flask Backend Server

Routes:
  GET  /           → Upload page (index.html)
  GET  /results    → Results page (results.html)
  POST /analyze    → Core analysis endpoint
  GET  /health     → Health check
"""

import os
import traceback
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from parser import extract_text_from_file
from analyzer import run_full_analysis

# ─── App Init ────────────────────────────────────────────────────────────────
load_dotenv()

app = Flask(__name__, static_folder="frontend")
CORS(app)

# ─── Static Routes ────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")

@app.route("/results")
def results():
    return send_from_directory("frontend", "results.html")

@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "SkillPath API", "version": "1.0.0"})

# ─── Core Analysis Endpoint ───────────────────────────────────────────────────
@app.route("/analyze", methods=["POST"])
def analyze():
    """
    POST /analyze
    Form data:
      - resume: file (PDF, DOCX, TXT)
      - jd_text: string (raw job description text)
    Returns: JSON with resume profile, JD analysis, and adaptive pathway
    """
    try:
        # Validate inputs
        resume_file = request.files.get("resume")
        jd_text = request.form.get("jd_text", "").strip()

        if not resume_file or not resume_file.filename:
            return jsonify({
                "success": False,
                "error": "Resume file is required. Please upload a PDF, DOCX, or TXT file."
            }), 400

        if not jd_text:
            return jsonify({
                "success": False,
                "error": "Job description is required. Please paste the full job description."
            }), 400

        if len(jd_text) < 50:
            return jsonify({
                "success": False,
                "error": "Job description too short. Please paste the complete job description."
            }), 400

        # Extract resume text
        try:
            resume_text = extract_text_from_file(resume_file)
        except Exception as e:
            return jsonify({
                "success": False,
                "error": f"Could not read resume: {str(e)}"
            }), 400

        if len(resume_text.strip()) < 100:
            return jsonify({
                "success": False,
                "error": "Resume appears to be empty or unreadable. Please try a different file."
            }), 400

        # Run full AI analysis pipeline
        result = run_full_analysis(resume_text, jd_text)
        return jsonify(result)

    except EnvironmentError as e:
        return jsonify({
            "success": False,
            "error": f"Configuration error: {str(e)}"
        }), 500

    except Exception as e:
        app.logger.error(f"Analysis error: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": f"Analysis failed: {str(e)}"
        }), 500


# ─── Entry Point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    print(f"\n🧠 SkillPath server starting on http://localhost:{port}")
    print(f"   ANTHROPIC_API_KEY: {'✅ Set' if os.getenv('ANTHROPIC_API_KEY') else '❌ NOT SET — check .env'}\n")
    app.run(debug=debug, host="0.0.0.0", port=port)
