"""
AI Analyzer Module — SkillPath Core Engine
Handles all Claude API interactions:
  1. Resume parsing → structured JSON profile
  2. Job Description parsing → structured requirements
  3. Skill gap analysis → delta computation
  4. Adaptive pathway generation → ordered curriculum with reasoning trace
"""

import json
import os
import re
import anthropic
from course_catalog import get_catalog_for_prompt, CATALOG_BY_ID
import mock_data


# Initialize Anthropic client
_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError("ANTHROPIC_API_KEY not set. Check your .env file.")
        _client = anthropic.Anthropic(api_key=api_key)
    return _client


def _call_claude(prompt: str, max_tokens: int = 1500) -> str:
    """Single-turn Claude call, returns raw text response."""
    client = get_client()
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=max_tokens,
        system=(
            "You are an expert AI talent analyst and corporate L&D architect. "
            "You always return ONLY valid, parseable JSON — no markdown fences, "
            "no explanation text, no preamble. Raw JSON only."
        ),
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text.strip()


def _safe_json_parse(raw: str) -> dict:
    """Parse JSON with fallback fence stripping."""
    raw = raw.strip()
    # Strip markdown code fences if present
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    return json.loads(raw)


# ─────────────────────────────────────────────────────────────────────────────
# STEP 1: Parse Resume
# ─────────────────────────────────────────────────────────────────────────────
def parse_resume(resume_text: str) -> dict:
    """Extract structured candidate profile from resume text."""
    prompt = f"""You are an expert HR analyst with 20 years of experience reading technical and non-technical resumes.
Your task is to extract every skill — technical AND soft — from the resume below with accurate proficiency levels and supporting evidence.

Before reading the actual resume, here are 3 calibration examples showing correct extraction:

--- EXAMPLE 1 ---
Resume says: "Led a team of 5 engineers to build and deploy microservices on AWS using Python and Kubernetes"
Correct extraction:
  python: advanced, evidence: "Led team deploying microservices"
  aws: advanced, evidence: "deploy on AWS"
  kubernetes: intermediate, evidence: "using Kubernetes"
  leadership: advanced, evidence: "Led a team of 5 engineers"

--- EXAMPLE 2 ---
Resume says: "Familiar with React.js and done some SQL queries"
Correct extraction:
  react: beginner, evidence: "Familiar with React.js"
  sql: beginner, evidence: "done some SQL queries"

--- EXAMPLE 3 ---
Resume says: "3 years building REST APIs with Django and PostgreSQL, managed junior developers"
Correct extraction:
  django: advanced, evidence: "3 years building REST APIs"
  postgresql: intermediate, evidence: "building...with PostgreSQL"
  rest api: advanced, evidence: "3 years building REST APIs"
  team management: intermediate, evidence: "managed junior developers"

--- NOW ANALYZE THIS RESUME ---
RESUME TEXT:
\"\"\"
{resume_text[:4000]}
\"\"\"

Return ONLY this JSON structure (no other text):
{{
  "name": "Full name or 'Unknown Candidate' if not found",
  "current_title": "Most recent job title",
  "experience_years": <integer total years of professional experience>,
  "education": {{
    "degree": "Highest degree (e.g., B.Tech, MBA, High School)",
    "field": "Field of study",
    "institution": "Institution name if available"
  }},
  "skills": [
    {{
      "skill": "exact skill name in lowercase",
      "level": "beginner | intermediate | advanced",
      "evidence": "brief quote or context from resume that indicates this skill level"
    }}
  ],
  "domains": ["list of professional domains e.g. software engineering, data science, operations, marketing"],
  "work_history": [
    {{
      "title": "Job title",
      "company": "Company name",
      "duration_years": <number or null>
    }}
  ]
}}

STRICT EXTRACTION RULES — FOLLOW EXACTLY:
- "level" must be EXACTLY one of: beginner, intermediate, advanced
- NEVER miss programming languages, frameworks, or cloud platforms — extract every one mentioned
- Extract soft skills too: leadership, communication, team management, mentoring, stakeholder management
- If years are mentioned explicitly: 1 yr = beginner, 2-3 yrs = intermediate, 4+ yrs = advanced
- If resume uses "familiar with", "exposure to", "some experience" → ALWAYS set level to beginner
- If resume uses "led", "architected", "designed", "owned", "spearheaded" → ALWAYS set level to advanced
- Extract ALL skills even if mentioned only once — a single mention counts
- experience_years must be an integer (estimate realistically if not explicitly stated)
"""
    raw = _call_claude(prompt, max_tokens=1500)
    return _safe_json_parse(raw)


# ─────────────────────────────────────────────────────────────────────────────
# STEP 2: Parse Job Description
# ─────────────────────────────────────────────────────────────────────────────
def parse_jd(jd_text: str) -> dict:
    """Extract structured requirements from a job description."""
    prompt = f"""You are an expert talent acquisition specialist with deep experience benchmarking roles across tech, business, and operations.
Your job is to extract every required and preferred skill from the job description below, accurately calibrating the expected proficiency level and business priority for each skill.

JOB DESCRIPTION:
\"\"\"
{jd_text[:3000]}
\"\"\"

Return ONLY this JSON structure (no other text):
{{
  "role_title": "Exact job title from the JD",
  "company": "Company name if mentioned, else 'Not specified'",
  "seniority": "junior | mid | senior | lead | executive",
  "domains": ["professional domains this role belongs to"],
  "required_skills": [
    {{
      "skill": "exact skill name in lowercase",
      "level": "beginner | intermediate | advanced",
      "priority": "must-have | nice-to-have",
      "context": "brief phrase from JD indicating why this skill is needed"
    }}
  ],
  "responsibilities": ["top 4-5 key responsibilities in brief phrases"],
  "culture_signals": ["any culture/soft-skill signals e.g. 'fast-paced', 'cross-functional', 'data-driven'"]
}}

STRICT EXTRACTION RULES — FOLLOW EXACTLY:
- Every skill level must be EXACTLY one of: beginner, intermediate, advanced
- Every priority must be EXACTLY one of: must-have, nice-to-have
- LEVEL INFERENCE RULES:
  * If JD uses "expert", "deep experience", "5+ years", "own", "mastery" → set level to advanced
  * If JD uses "proficient", "strong", "3+ years", "hands-on" → set level to intermediate
  * If JD uses "familiar", "exposure", "basic", "understanding of" → set level to beginner
- PRIORITY INFERENCE RULES:
  * If JD uses "required", "must have", "essential", "critical" → set priority to must-have
  * If JD uses "familiar", "exposure", "nice to have", "bonus", "preferred", "plus" → set priority to nice-to-have
- ALWAYS extract both hard technical skills (tools, languages, platforms) AND soft skills (communication, leadership, collaboration, stakeholder management)
- Infer seniority from title and responsibility language (e.g., "manages a team" = lead+)
"""
    raw = _call_claude(prompt, max_tokens=1200)
    return _safe_json_parse(raw)


# ─────────────────────────────────────────────────────────────────────────────
# STEP 3: Compute Skill Gap + Generate Adaptive Pathway
# ─────────────────────────────────────────────────────────────────────────────
def generate_pathway(resume_data: dict, jd_data: dict) -> dict:
    """
    Core adaptive algorithm:
    1. Compare candidate skills vs JD requirements
    2. Classify each required skill: present / partial / missing
    3. Select and sequence courses from catalog to close gaps
    4. Provide per-course reasoning trace
    """
    catalog = get_catalog_for_prompt()
    catalog_json = json.dumps(catalog, indent=2)

    prompt = f"""You are a senior Learning and Development architect at a Fortune 500 company who has designed onboarding programs for over 10,000 employees across technical and non-technical roles.
Your job is to create a personalized, adaptive onboarding pathway that is tightly tailored to the candidate's actual gaps — not a generic training plan.

═══ CANDIDATE PROFILE ═══
{json.dumps(resume_data, indent=2)}

═══ TARGET ROLE ═══
{json.dumps(jd_data, indent=2)}

═══ COURSE CATALOG (USE ONLY THESE COURSES — NO HALLUCINATION) ═══
{catalog_json}

═══ YOUR TASK ═══
1. Analyze the skill gap between the candidate and the role
2. For each required skill, determine: PRESENT (candidate clearly has it), PARTIAL (has some exposure but needs deepening), or MISSING (no evidence in resume)
3. Select ONLY courses from the catalog above (use exact IDs) that address PARTIAL or MISSING skills
4. Order courses logically: prerequisites first, then foundational → advanced
5. Do NOT include courses for skills already at PRESENT level — this is the adaptive intelligence
6. Write a specific, personalized reasoning for each selected course
7. Estimate total training time saved vs a standard (non-adaptive) onboarding

Return ONLY this JSON structure (no other text):
{{
  "skill_gap_summary": "2-3 sentence executive summary of the candidate's profile vs role requirements",
  "readiness_score": <integer 0-100, how close candidate is to role-ready>,
  "time_saved_days": <integer, estimated days of redundant training eliminated>,
  "skills_analysis": [
    {{
      "skill": "skill name",
      "status": "present | partial | missing",
      "candidate_level": "beginner | intermediate | advanced | none",
      "required_level": "beginner | intermediate | advanced",
      "priority": "must-have | nice-to-have"
    }}
  ],
  "skills_present": ["list of skill names the candidate already has at required level"],
  "skills_partial": ["list of skill names candidate has but needs to strengthen"],
  "skills_missing": ["list of skill names the candidate lacks entirely"],
  "estimated_total_days": <total training days in pathway as integer>,
  "pathway": [
    {{
      "order": <integer starting at 1>,
      "course_id": "EXACT ID from catalog",
      "course_title": "EXACT title from catalog",
      "duration": "EXACT duration from catalog",
      "level": "beginner | intermediate | advanced",
      "domain": "technical | business | operational | product",
      "addresses_skill_gap": ["list of specific skills from skills_missing or skills_partial this course covers"],
      "reasoning": "Specific 2-sentence explanation: (1) what gap it closes for THIS candidate, (2) why it's sequenced at this point",
      "expected_outcome": "Concrete skill or ability the candidate will have after completing this module"
    }}
  ],
  "reasoning_trace": {{
    "approach": "Brief description of the sequencing logic used",
    "prerequisites_applied": ["any prerequisite chains enforced"],
    "skipped_courses": ["courses NOT selected and why — proves adaptive logic"],
    "confidence": "high | medium | low",
    "confidence_reason": "why this confidence level"
  }}
}}

CRITICAL RULES:
- Only use course IDs that exist in the catalog
- The pathway must be sorted by 'order' starting from 1
- Never add courses for skills already at PRESENT status
- reasoning must reference the specific candidate and role title by name — NEVER write a generic reason
- estimated_total_days must be the sum of durations in pathway
- STRICT SEQUENCING RULES:
  * For operational roles: always place safety/compliance courses (SAF01, SEC01) in the first 2 slots
  * For management roles: always include communication courses (COM01, LDR01) within the top 3
  * For technical roles: always put foundational tool courses before advanced ones per prerequisite chains
  * NEVER assign more than 8 courses total — exceeding this causes onboarding fatigue
  * If the candidate has 5 or more years of experience, SKIP all beginner-level courses entirely
"""

    raw = _call_claude(prompt, max_tokens=2500)
    pathway_data = _safe_json_parse(raw)

    # Post-process: enrich pathway items with full catalog data
    for item in pathway_data.get("pathway", []):
        course_id = item.get("course_id")
        if course_id in CATALOG_BY_ID:
            catalog_course = CATALOG_BY_ID[course_id]
            item["description"] = catalog_course.get("description", "")
            item["prerequisites"] = catalog_course.get("prerequisites", [])

    return pathway_data


# ─────────────────────────────────────────────────────────────────────────────
# DIAGNOSTIC MODE: Generate Quiz Questions
# ─────────────────────────────────────────────────────────────────────────────
def generate_diagnostic_quiz(jd_text: str, use_mock: bool = False) -> dict:
    """
    From a job description, generate 8 MCQ skill-diagnostic questions.
    Each question tests a specific skill required by the role.
    Returns structured questions for the frontend quiz interface.
    """
    if use_mock:
        return {"role_title": "Senior Engineer (Demo)", "questions": mock_data.get_mock_questions()}

    prompt = f"""You are an expert corporate learning assessor with deep experience designing psychometric assessments for onboarding programs across technical and non-technical roles.
Generate a high-quality skill diagnostic quiz for a new hire based on this job description.

JOB DESCRIPTION:
\"\"\"
{jd_text[:3000]}
\"\"\"

Create EXACTLY 8 multiple-choice questions. Each question must test a DIFFERENT skill domain required by this role.

Return ONLY this JSON structure (no other text):
{{
  "role_title": "job title extracted from JD",
  "questions": [
    {{
      "id": 1,
      "domain": "short domain label e.g. 'Python', 'Data Analysis', 'Leadership', 'SQL', 'Cloud'",
      "skill": "specific skill being tested in lowercase",
      "question": "Clear, scenario-based question text testing this skill",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correct_index": <0-3, index of correct option in options array>,
      "explanation": "2-3 sentence explanation: (1) why the correct answer is right, AND (2) why the most tempting wrong answer is incorrect",
      "difficulty": "beginner | intermediate | advanced"
    }}
  ]
}}

STRICT RULES — FOLLOW EXACTLY:
- Each question MUST test a DIFFERENT skill domain from the JD — no domain may appear twice
- DIFFICULTY DISTRIBUTION: exactly 3 beginner questions, 3 intermediate questions, 2 advanced questions
- QUESTION FORMAT: use scenario-based framing wherever possible — e.g. "A new engineer on your team needs to..." or "You are asked to..." rather than abstract "What is..." questions
- WRONG ANSWERS: all 3 wrong options must be plausible and tempting — common misconceptions, real alternatives, or subtly incorrect values. Never include obviously absurd options
- EXPLANATION: must specifically explain WHY the correct answer is right AND why the single most tempting wrong answer fails — not just restate the correct answer
- correct_index must be 0, 1, 2, or 3 (valid index into the 4-item options array)
- domain labels should be SHORT (1-3 words)
- Ensure EXACTLY 8 questions — no more, no fewer
"""
    raw = _call_claude(prompt, max_tokens=2500)
    return _safe_json_parse(raw)


# ─────────────────────────────────────────────────────────────────────────────
# DIAGNOSTIC MODE: Analyze Quiz Answers → Generate Pathway
# ─────────────────────────────────────────────────────────────────────────────
def analyze_diagnostic_results(jd_text: str, answers: list, role_title: str = "", use_mock: bool = False) -> dict:
    """
    Convert diagnostic quiz answers into a synthetic skill profile,
    then generate an adaptive learning pathway — same output format as resume-mode.
    """
    if use_mock:
        return mock_data.get_mock_analysis("Diagnostic Candidate", role_title or "Target Role (Demo)")

    # Build a narrative skill profile from quiz answers
    correct_skills = [a["skill"] for a in answers if a.get("correct") and not a.get("skipped")]
    incorrect_skills = [a["skill"] for a in answers if not a.get("correct") and not a.get("skipped")]
    skipped_skills = [a["skill"] for a in answers if a.get("skipped")]

    score_pct = round(len(correct_skills) / max(len(answers), 1) * 100)

    # Synthesize a resume-like profile from the diagnostic answers
    synthetic_resume = {
        "name": "Diagnostic Candidate",
        "current_title": "New Hire (via Skill Diagnostic)",
        "experience_years": 0,
        "education": {"degree": "Unknown", "field": "Unknown", "institution": "Unknown"},
        "skills": (
            [{"skill": s, "level": "intermediate", "evidence": "Answered correctly in diagnostic"} for s in correct_skills] +
            [{"skill": s, "level": "beginner", "evidence": "Answered incorrectly — needs development"} for s in incorrect_skills]
        ),
        "domains": list(set(a.get("domain","General") for a in answers)),
        "work_history": [],
        "diagnostic_score": score_pct,
        "diagnostic_mode": True
    }

    jd_data = parse_jd(jd_text)
    if role_title:
        jd_data["role_title"] = role_title

    pathway_data = generate_pathway(synthetic_resume, jd_data)

    return {
        "success": True,
        "resume": synthetic_resume,
        "job": jd_data,
        "pathway": pathway_data,
        "diagnostic": {
            "score_pct": score_pct,
            "correct_skills": correct_skills,
            "incorrect_skills": incorrect_skills,
            "skipped_skills": skipped_skills,
            "total_questions": len(answers),
            "mode": "diagnostic"
        }
    }


# ─────────────────────────────────────────────────────────────────────────────
# Full pipeline (convenience function)
# ─────────────────────────────────────────────────────────────────────────────
def run_full_analysis(resume_text: str, jd_text: str, resume_metadata: dict = None, use_mock: bool = False) -> dict:
    """
    Execute the full SkillPath pipeline:
    resume_text + jd_text → structured analysis + adaptive pathway
    """
    if use_mock:
        mock_res = mock_data.get_mock_analysis((resume_metadata or {}).get("name", "Alex Riviera"), "Senior Developer (Demo)")
        return mock_res

    resume_data = parse_resume(resume_text)
    jd_data = parse_jd(jd_text)
    pathway_data = generate_pathway(resume_data, jd_data)
    return {
        "success": True,
        "resume": resume_data,
        "job": jd_data,
        "pathway": pathway_data
    }
