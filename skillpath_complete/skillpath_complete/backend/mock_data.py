"""
Mock data for SkillPath demo mode.
Set USE_MOCK_DATA=true in .env to skip Claude API calls.
"""

def get_mock_questions():
    return [
        {
            "id": 1, "domain": "Python", "skill": "python",
            "question": "You need to process 1 million CSV rows efficiently. Best approach?",
            "options": ["Load all into a list", "Use pandas with chunksize", "Read line by line", "Convert to JSON first"],
            "correct_index": 1,
            "explanation": "Pandas chunksize processes in batches avoiding memory overflow.",
            "difficulty": "intermediate"
        },
        {
            "id": 2, "domain": "SQL", "skill": "sql",
            "question": "A query is slow on 10M rows filtered by email. First fix?",
            "options": ["Add RAM", "Create index on email", "Split the table", "Use subquery"],
            "correct_index": 1,
            "explanation": "Index on filter column reduces full scans to O(log n).",
            "difficulty": "beginner"
        },
        {
            "id": 3, "domain": "AWS", "skill": "aws",
            "question": "Run code only when a file is uploaded to S3. Cheapest solution?",
            "options": ["EC2 polling S3", "ECS every minute", "Lambda S3 trigger", "CloudWatch rule"],
            "correct_index": 2,
            "explanation": "Lambda triggers only on events, costs near zero at low volume.",
            "difficulty": "intermediate"
        },
        {
            "id": 4, "domain": "Docker", "skill": "docker",
            "question": "Docker image is 2GB. Fastest way to reduce size?",
            "options": ["Use python:3.11-slim base", "Delete logs in container", "Compress after build", "Remove Dockerfile comments"],
            "correct_index": 0,
            "explanation": "Base image choice is the biggest size factor. slim is ~200MB vs ~1GB.",
            "difficulty": "beginner"
        },
        {
            "id": 5, "domain": "Spark", "skill": "apache spark",
            "question": "Spark job fails with OutOfMemoryError on executor. Most likely cause?",
            "options": ["Too many columns", "Skewed join on one partition", "Using Python not Scala", "Too many nodes"],
            "correct_index": 1,
            "explanation": "Data skew sends disproportionate data to one executor. Salting resolves it.",
            "difficulty": "advanced"
        },
        {
            "id": 6, "domain": "Git", "skill": "git",
            "question": "Committed credentials to public repo. Immediate correct action?",
            "options": ["Delete commit message", "Make repo private", "Revoke credentials then fix history", "Overwrite with empty file"],
            "correct_index": 2,
            "explanation": "Revoke first — secret is already exposed. History rewrite alone is insufficient.",
            "difficulty": "beginner"
        },
        {
            "id": 7, "domain": "Leadership", "skill": "team management",
            "question": "Junior engineer misses deadlines but produces high quality work. You should?",
            "options": ["Escalate to HR", "Remove from critical path", "Private 1-1 to find blockers", "Set stricter deadlines publicly"],
            "correct_index": 2,
            "explanation": "Private coaching addresses root causes without damaging morale.",
            "difficulty": "intermediate"
        },
        {
            "id": 8, "domain": "System Design", "skill": "distributed systems",
            "question": "System needs to serve 100K requests/second. First architecture decision?",
            "options": ["Choose fastest language", "Horizontal scaling with stateless services", "Use largest single server", "Store all data in memory"],
            "correct_index": 1,
            "explanation": "Horizontal scaling with stateless services handles unpredictable load. Vertical scaling has hard limits.",
            "difficulty": "advanced"
        }
    ]


def get_mock_analysis(candidate_name: str = "Alex Rivera",
                      role_title: str = "Senior Data Engineer"):
    return {
        "success": True,
        "resume": {
            "name": candidate_name,
            "current_title": "Junior Python Developer",
            "experience_years": 2,
            "education": {"degree": "B.Tech", "field": "Computer Science", "institution": "Demo University"},
            "skills": [
                {"skill": "python",     "level": "intermediate", "evidence": "2 years building REST APIs"},
                {"skill": "sql",        "level": "beginner",     "evidence": "basic queries only"},
                {"skill": "git",        "level": "intermediate", "evidence": "daily use in team"},
                {"skill": "flask",      "level": "intermediate", "evidence": "REST API development"},
                {"skill": "docker",     "level": "beginner",     "evidence": "ran pre-built containers locally"},
            ],
            "domains": ["software engineering"],
            "work_history": [{"title": "Junior Developer", "company": "TechCorp", "duration_years": 2}]
        },
        "job": {
            "role_title": role_title,
            "company": "Demo Corp",
            "seniority": "senior",
            "domains": ["data engineering", "cloud"],
            "required_skills": [
                {"skill": "python",       "level": "advanced",      "priority": "must-have", "context": "production pipelines"},
                {"skill": "apache spark", "level": "advanced",      "priority": "must-have", "context": "big data processing"},
                {"skill": "aws",          "level": "intermediate",  "priority": "must-have", "context": "cloud infrastructure"},
                {"skill": "sql",          "level": "advanced",      "priority": "must-have", "context": "query optimisation"},
                {"skill": "airflow",      "level": "intermediate",  "priority": "must-have", "context": "workflow orchestration"},
                {"skill": "docker",       "level": "intermediate",  "priority": "nice-to-have", "context": "containerisation"},
                {"skill": "kubernetes",   "level": "beginner",      "priority": "nice-to-have", "context": "deployment"},
            ],
            "responsibilities": ["Build data pipelines", "Optimise queries", "Lead technical design"],
            "culture_signals": ["fast-paced", "data-driven", "cross-functional"]
        },
        "pathway": {
            "skill_gap_summary": f"{candidate_name} has solid Python and Flask foundations but lacks the big data, cloud, and pipeline orchestration skills for this senior data engineering role.",
            "readiness_score": 32,
            "time_saved_days": 6,
            "skills_present": ["python", "git", "flask"],
            "skills_partial": ["sql", "docker"],
            "skills_missing": ["apache spark", "aws", "airflow", "kubernetes"],
            "estimated_total_days": 12,
            "skills_analysis": [
                {"skill": "python",       "status": "partial",  "candidate_level": "intermediate", "required_level": "advanced",     "priority": "must-have"},
                {"skill": "sql",          "status": "partial",  "candidate_level": "beginner",     "required_level": "advanced",     "priority": "must-have"},
                {"skill": "apache spark", "status": "missing",  "candidate_level": "none",         "required_level": "advanced",     "priority": "must-have"},
                {"skill": "aws",          "status": "missing",  "candidate_level": "none",         "required_level": "intermediate", "priority": "must-have"},
                {"skill": "airflow",      "status": "missing",  "candidate_level": "none",         "required_level": "intermediate", "priority": "must-have"},
                {"skill": "docker",       "status": "partial",  "candidate_level": "beginner",     "required_level": "intermediate", "priority": "nice-to-have"},
                {"skill": "git",          "status": "present",  "candidate_level": "intermediate", "required_level": "intermediate", "priority": "must-have"},
            ],
            "pathway": [
                {
                    "order": 1, "course_id": "PY02",
                    "course_title": "Python Advanced: OOP & Design Patterns",
                    "duration": "3 days", "level": "intermediate", "domain": "technical",
                    "addresses_skill_gap": ["python"],
                    "reasoning": f"{candidate_name} has intermediate Python but the {role_title} role requires advanced-level production code.",
                    "expected_outcome": "Write production-grade Python with design patterns used in data engineering.",
                    "description": "Classes, inheritance, decorators, generators, design patterns"
                },
                {
                    "order": 2, "course_id": "SQL02",
                    "course_title": "Advanced SQL & Query Optimisation",
                    "duration": "2 days", "level": "advanced", "domain": "technical",
                    "addresses_skill_gap": ["sql"],
                    "reasoning": f"{candidate_name} only has basic SQL but the role requires advanced query optimisation.",
                    "expected_outcome": "Write complex analytical queries and optimise slow operations.",
                    "description": "Window functions, CTEs, execution plans, database tuning"
                },
                {
                    "order": 3, "course_id": "CLD01",
                    "course_title": "Cloud Computing Fundamentals (AWS)",
                    "duration": "3 days", "level": "beginner", "domain": "technical",
                    "addresses_skill_gap": ["aws"],
                    "reasoning": f"{candidate_name} has no cloud experience and AWS is a must-have for this role.",
                    "expected_outcome": "Work confidently with AWS compute, storage, and networking.",
                    "description": "Cloud concepts, compute, storage, networking basics"
                },
                {
                    "order": 4, "course_id": "DOC01",
                    "course_title": "Docker & Containerisation",
                    "duration": "2 days", "level": "intermediate", "domain": "technical",
                    "addresses_skill_gap": ["docker"],
                    "reasoning": f"{candidate_name} has only run pre-built containers. Role requires building and deploying containerised services.",
                    "expected_outcome": "Build Docker images, write Compose files, deploy containerised apps.",
                    "description": "Docker images, containers, Compose, best practices"
                },
                {
                    "order": 5, "course_id": "CICD01",
                    "course_title": "CI/CD Pipelines & DevOps Practices",
                    "duration": "2 days", "level": "intermediate", "domain": "technical",
                    "addresses_skill_gap": ["airflow"],
                    "reasoning": f"Pipeline orchestration concepts from CI/CD transfer directly to Airflow DAG design.",
                    "expected_outcome": "Understand automated pipeline patterns applicable to Airflow orchestration.",
                    "description": "Pipeline design, automated testing, deployment strategies"
                },
            ],
            "reasoning_trace": {
                "approach": "Foundational gaps first, then cloud prerequisites before platform-specific tools.",
                "prerequisites_applied": ["SQL01 → SQL02", "CLD01 → CLD02", "GIT01 → DOC01"],
                "skipped_courses": [
                    "PY01 Python Fundamentals — candidate already has intermediate Python",
                    "GIT01 Git Basics — candidate uses Git daily",
                    "COM01 Communication — not flagged as priority in JD"
                ],
                "confidence": "high",
                "confidence_reason": "Clear skill evidence in resume and explicit requirements in JD."
            }
        }
    }
