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
        model="claude-sonnet-4-20250514",
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
    prompt = f"""Analyze the following resume and extract a structured professional profile.

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

Rules:
- "level" must be EXACTLY one of: beginner, intermediate, advanced
- Extract ALL skills mentioned: technical tools, soft skills, methodologies, languages
- Infer skill level from context (e.g., "led a team" = leadership:advanced; "familiar with" = beginner)
- experience_years must be an integer (estimate if exact not stated)
"""
    raw = _call_claude(prompt, max_tokens=1500)
    return _safe_json_parse(raw)


# ─────────────────────────────────────────────────────────────────────────────
# STEP 2: Parse Job Description
# ─────────────────────────────────────────────────────────────────────────────
def parse_jd(jd_text: str) -> dict:
    """Extract structured requirements from a job description."""
    prompt = f"""Analyze the following job description and extract structured requirements.

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

Rules:
- Every skill level must be EXACTLY one of: beginner, intermediate, advanced
- Every priority must be EXACTLY one of: must-have, nice-to-have
- Extract both hard skills (tools, languages) AND soft skills (leadership, communication)
- Infer seniority from title and responsibility language
"""
    raw = _call_claude(prompt, max_tokens=1000)
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

    prompt = f"""You are an expert corporate Learning & Development architect.
Your job is to create a personalized, adaptive onboarding pathway.

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
- reasoning must reference the specific candidate and role, not be generic
- estimated_total_days must be the sum of durations in pathway
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
# Full pipeline (convenience function)
# ─────────────────────────────────────────────────────────────────────────────
def run_full_analysis(resume_text: str, jd_text: str) -> dict:
    """
    Execute the full SkillPath pipeline:
    resume_text + jd_text → structured analysis + adaptive pathway
    """
    resume_data = parse_resume(resume_text)
    jd_data = parse_jd(jd_text)
    pathway_data = generate_pathway(resume_data, jd_data)
    return {
        "success": True,
        "resume": resume_data,
        "job": jd_data,
        "pathway": pathway_data
    }
