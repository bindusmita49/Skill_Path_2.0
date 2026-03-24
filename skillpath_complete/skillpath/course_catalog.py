"""
SkillPath Course Catalog
Grounded, hallucination-proof course database for adaptive pathway generation.
All courses are tagged with skills, prerequisites, domain, and difficulty.
"""

COURSE_CATALOG = [
    # ─── PROGRAMMING & SOFTWARE DEVELOPMENT ───────────────────────────────────
    {
        "id": "PY01", "title": "Python Fundamentals",
        "skills": ["python", "programming", "scripting", "coding", "basic programming"],
        "duration": "3 days", "level": "beginner", "domain": "technical",
        "description": "Variables, data types, control flow, functions, and basic OOP",
        "prerequisites": []
    },
    {
        "id": "PY02", "title": "Python Advanced: OOP & Design Patterns",
        "skills": ["python", "oop", "object oriented programming", "software design", "design patterns", "advanced python"],
        "duration": "3 days", "level": "intermediate", "domain": "technical",
        "description": "Classes, inheritance, decorators, generators, design patterns",
        "prerequisites": ["PY01"]
    },
    {
        "id": "PY03", "title": "Python for Automation & Scripting",
        "skills": ["python", "automation", "scripting", "devops", "bash", "shell"],
        "duration": "2 days", "level": "intermediate", "domain": "technical",
        "description": "File I/O, OS operations, task automation, scheduling",
        "prerequisites": ["PY01"]
    },
    {
        "id": "JS01", "title": "JavaScript & TypeScript Essentials",
        "skills": ["javascript", "typescript", "js", "ts", "web development", "frontend"],
        "duration": "3 days", "level": "beginner", "domain": "technical",
        "description": "ES6+, async/await, TypeScript typing, modern JS patterns",
        "prerequisites": []
    },
    {
        "id": "JS02", "title": "React.js & Modern Frontend Development",
        "skills": ["react", "react.js", "reactjs", "frontend", "jsx", "redux", "hooks", "web development"],
        "duration": "4 days", "level": "intermediate", "domain": "technical",
        "description": "Components, hooks, state management, React Router, Redux",
        "prerequisites": ["JS01"]
    },
    {
        "id": "BE01", "title": "Backend Development with Node.js",
        "skills": ["node.js", "nodejs", "backend", "express", "api development", "server side"],
        "duration": "3 days", "level": "intermediate", "domain": "technical",
        "description": "REST APIs, middleware, authentication, database integration",
        "prerequisites": ["JS01"]
    },
    {
        "id": "GIT01", "title": "Git, GitHub & Version Control",
        "skills": ["git", "github", "version control", "branching", "ci/cd", "devops"],
        "duration": "1 day", "level": "beginner", "domain": "technical",
        "description": "Branching strategies, pull requests, merge conflicts, Git workflows",
        "prerequisites": []
    },
    # ─── DATA & ANALYTICS ────────────────────────────────────────────────────────
    {
        "id": "SQL01", "title": "SQL & Relational Databases",
        "skills": ["sql", "databases", "mysql", "postgresql", "relational database", "querying", "db"],
        "duration": "2 days", "level": "beginner", "domain": "technical",
        "description": "SELECT, JOINs, aggregations, indexes, stored procedures",
        "prerequisites": []
    },
    {
        "id": "SQL02", "title": "Advanced SQL & Query Optimization",
        "skills": ["sql", "query optimization", "performance tuning", "database design", "advanced sql", "analytics"],
        "duration": "2 days", "level": "advanced", "domain": "technical",
        "description": "Window functions, CTEs, execution plans, database tuning",
        "prerequisites": ["SQL01"]
    },
    {
        "id": "DA01", "title": "Data Analysis with Python (Pandas & NumPy)",
        "skills": ["data analysis", "pandas", "numpy", "python", "data manipulation", "eda", "exploratory data analysis"],
        "duration": "3 days", "level": "intermediate", "domain": "technical",
        "description": "DataFrames, data cleaning, EDA, statistical analysis",
        "prerequisites": ["PY01"]
    },
    {
        "id": "DA02", "title": "Data Visualization & Business Intelligence",
        "skills": ["data visualization", "matplotlib", "seaborn", "plotly", "power bi", "tableau", "dashboards", "bi"],
        "duration": "2 days", "level": "intermediate", "domain": "technical",
        "description": "Charts, dashboards, storytelling with data, BI tools",
        "prerequisites": ["DA01"]
    },
    {
        "id": "ML01", "title": "Machine Learning Fundamentals",
        "skills": ["machine learning", "ml", "scikit-learn", "sklearn", "supervised learning", "classification", "regression", "statistics"],
        "duration": "5 days", "level": "intermediate", "domain": "technical",
        "description": "Supervised/unsupervised learning, model evaluation, feature engineering",
        "prerequisites": ["DA01"]
    },
    {
        "id": "ML02", "title": "Deep Learning & Neural Networks",
        "skills": ["deep learning", "tensorflow", "pytorch", "neural networks", "cnn", "rnn", "transformers", "ai"],
        "duration": "5 days", "level": "advanced", "domain": "technical",
        "description": "CNNs, RNNs, transformers, model training and deployment",
        "prerequisites": ["ML01"]
    },
    {
        "id": "ML03", "title": "Natural Language Processing (NLP)",
        "skills": ["nlp", "natural language processing", "text analysis", "bert", "llm", "language models", "transformers"],
        "duration": "4 days", "level": "advanced", "domain": "technical",
        "description": "Text preprocessing, embeddings, sentiment analysis, LLMs",
        "prerequisites": ["ML01"]
    },
    # ─── CLOUD & DEVOPS ───────────────────────────────────────────────────────────
    {
        "id": "CLD01", "title": "Cloud Computing Fundamentals (AWS/GCP/Azure)",
        "skills": ["cloud", "aws", "gcp", "azure", "cloud computing", "iaas", "paas", "saas"],
        "duration": "3 days", "level": "beginner", "domain": "technical",
        "description": "Cloud concepts, major providers, compute, storage, networking basics",
        "prerequisites": []
    },
    {
        "id": "CLD02", "title": "AWS Solutions Architecture",
        "skills": ["aws", "amazon web services", "ec2", "s3", "lambda", "solutions architect", "cloud architecture"],
        "duration": "4 days", "level": "intermediate", "domain": "technical",
        "description": "EC2, S3, Lambda, VPC, IAM, RDS, auto-scaling",
        "prerequisites": ["CLD01"]
    },
    {
        "id": "DOC01", "title": "Docker & Containerization",
        "skills": ["docker", "containers", "containerization", "devops", "microservices"],
        "duration": "2 days", "level": "intermediate", "domain": "technical",
        "description": "Docker images, containers, Compose, best practices",
        "prerequisites": ["GIT01"]
    },
    {
        "id": "DOC02", "title": "Kubernetes & Container Orchestration",
        "skills": ["kubernetes", "k8s", "container orchestration", "devops", "microservices", "deployment"],
        "duration": "3 days", "level": "advanced", "domain": "technical",
        "description": "Pods, deployments, services, ingress, scaling, Helm",
        "prerequisites": ["DOC01"]
    },
    {
        "id": "CICD01", "title": "CI/CD Pipelines & DevOps Practices",
        "skills": ["ci/cd", "devops", "jenkins", "github actions", "continuous integration", "continuous deployment", "automation"],
        "duration": "2 days", "level": "intermediate", "domain": "technical",
        "description": "Pipeline design, automated testing, deployment strategies",
        "prerequisites": ["GIT01"]
    },
    # ─── SECURITY ─────────────────────────────────────────────────────────────────
    {
        "id": "SEC01", "title": "Cybersecurity Fundamentals",
        "skills": ["security", "cybersecurity", "information security", "infosec", "networking", "compliance", "risk"],
        "duration": "2 days", "level": "beginner", "domain": "technical",
        "description": "Threat models, authentication, encryption, OWASP Top 10",
        "prerequisites": []
    },
    {
        "id": "SEC02", "title": "Application Security & Secure Coding",
        "skills": ["application security", "secure coding", "owasp", "penetration testing", "vulnerability", "appsec"],
        "duration": "3 days", "level": "intermediate", "domain": "technical",
        "description": "Secure code review, SAST/DAST, common vulnerabilities and fixes",
        "prerequisites": ["SEC01"]
    },
    # ─── BUSINESS & MANAGEMENT ────────────────────────────────────────────────────
    {
        "id": "PM01", "title": "Project Management Essentials",
        "skills": ["project management", "planning", "stakeholder management", "scope", "risk management", "pmp"],
        "duration": "2 days", "level": "beginner", "domain": "business",
        "description": "Project lifecycle, risk management, stakeholder communication",
        "prerequisites": []
    },
    {
        "id": "AGI01", "title": "Agile & Scrum Methodology",
        "skills": ["agile", "scrum", "sprint", "kanban", "jira", "product backlog", "standup", "agile methodology"],
        "duration": "1 day", "level": "beginner", "domain": "business",
        "description": "Scrum ceremonies, Kanban boards, sprint planning, retrospectives",
        "prerequisites": []
    },
    {
        "id": "LDR01", "title": "Leadership & Team Management",
        "skills": ["leadership", "management", "team building", "mentoring", "team lead", "manager", "people management"],
        "duration": "2 days", "level": "intermediate", "domain": "business",
        "description": "Leadership styles, conflict resolution, performance management",
        "prerequisites": []
    },
    {
        "id": "COM01", "title": "Business Communication & Executive Presence",
        "skills": ["communication", "writing", "reporting", "presentations", "public speaking", "executive communication", "business writing"],
        "duration": "1 day", "level": "beginner", "domain": "business",
        "description": "Email etiquette, stakeholder presentations, executive reporting",
        "prerequisites": []
    },
    {
        "id": "STR01", "title": "Strategic Thinking & Business Analysis",
        "skills": ["strategy", "business analysis", "strategic planning", "business strategy", "competitive analysis", "swot"],
        "duration": "2 days", "level": "intermediate", "domain": "business",
        "description": "Strategic frameworks, market analysis, business case development",
        "prerequisites": []
    },
    # ─── FINANCE & OPERATIONS ──────────────────────────────────────────────────────
    {
        "id": "FIN01", "title": "Financial Reporting & Budgeting",
        "skills": ["finance", "accounting", "budgeting", "financial analysis", "p&l", "financial reporting", "forecasting"],
        "duration": "2 days", "level": "intermediate", "domain": "business",
        "description": "P&L statements, budget management, financial modeling basics",
        "prerequisites": []
    },
    {
        "id": "XL01", "title": "Advanced Excel & Data Reporting",
        "skills": ["excel", "spreadsheets", "reporting", "pivot tables", "data entry", "microsoft office", "vlookup"],
        "duration": "1 day", "level": "beginner", "domain": "business",
        "description": "VLOOKUP, pivot tables, macros, advanced charting",
        "prerequisites": []
    },
    {
        "id": "CRM01", "title": "CRM & Customer Success Management",
        "skills": ["crm", "salesforce", "customer service", "customer success", "sales", "hubspot", "customer relationship"],
        "duration": "2 days", "level": "beginner", "domain": "business",
        "description": "CRM workflows, pipeline management, customer lifecycle",
        "prerequisites": []
    },
    # ─── OPERATIONS & LABOR ───────────────────────────────────────────────────────
    {
        "id": "OPS01", "title": "Warehouse & Logistics Operations",
        "skills": ["logistics", "warehouse", "inventory", "supply chain", "wms", "fulfillment", "operations"],
        "duration": "2 days", "level": "beginner", "domain": "operational",
        "description": "Warehouse management, inventory control, fulfillment workflows",
        "prerequisites": []
    },
    {
        "id": "OPS02", "title": "Supply Chain & Procurement Management",
        "skills": ["supply chain", "procurement", "vendor management", "sourcing", "logistics", "purchasing"],
        "duration": "2 days", "level": "intermediate", "domain": "operational",
        "description": "Vendor selection, procurement strategy, supply chain optimization",
        "prerequisites": []
    },
    {
        "id": "SAF01", "title": "Workplace Safety & OSHA Compliance",
        "skills": ["safety", "compliance", "osha", "regulations", "workplace safety", "health and safety", "ehs"],
        "duration": "1 day", "level": "beginner", "domain": "operational",
        "description": "OSHA standards, hazard identification, safety protocols",
        "prerequisites": []
    },
    {
        "id": "QA01", "title": "Quality Assurance & Process Improvement",
        "skills": ["quality assurance", "qa", "six sigma", "lean", "process improvement", "quality control", "iso"],
        "duration": "2 days", "level": "intermediate", "domain": "operational",
        "description": "Six Sigma, Lean methodologies, process auditing",
        "prerequisites": []
    },
    # ─── PRODUCT & DESIGN ───────────────────────────────────────────────────────
    {
        "id": "PRD01", "title": "Product Management Fundamentals",
        "skills": ["product management", "product manager", "roadmap", "user stories", "product strategy", "prd"],
        "duration": "2 days", "level": "beginner", "domain": "product",
        "description": "Product lifecycle, roadmapping, user research, prioritization frameworks",
        "prerequisites": []
    },
    {
        "id": "UX01", "title": "UX Design & User Research",
        "skills": ["ux", "user experience", "ui", "user interface", "figma", "design thinking", "wireframing", "prototyping"],
        "duration": "3 days", "level": "beginner", "domain": "product",
        "description": "User research, wireframing, prototyping, usability testing",
        "prerequisites": []
    },
    {
        "id": "API01", "title": "REST API Design & Integration",
        "skills": ["api", "rest", "restful", "api design", "integration", "swagger", "openapi", "backend", "web services"],
        "duration": "2 days", "level": "intermediate", "domain": "technical",
        "description": "REST principles, API documentation, authentication patterns",
        "prerequisites": ["GIT01"]
    },
]

# Build lookup dict for fast access
CATALOG_BY_ID = {c["id"]: c for c in COURSE_CATALOG}

def get_catalog_for_prompt():
    """Return a compact version of the catalog for LLM prompts."""
    compact = []
    for c in COURSE_CATALOG:
        compact.append({
            "id": c["id"],
            "title": c["title"],
            "skills": c["skills"],
            "duration": c["duration"],
            "level": c["level"],
            "domain": c["domain"],
            "description": c["description"],
            "prerequisites": c["prerequisites"]
        })
    return compact
