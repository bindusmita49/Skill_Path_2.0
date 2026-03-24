# SkillPath — AI-Adaptive Onboarding Engine

> Next.js frontend + Python Flask backend connected together.

---

## Project Structure

```
skillpath_complete/
├── backend/          ← Python Flask API (runs on port 5000)
│   ├── app.py
│   ├── analyzer.py
│   ├── parser.py
│   ├── course_catalog.py
│   ├── export_pptx.py
│   ├── mock_data.py
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
└── frontend/         ← Next.js app (runs on port 3000)
    ├── app/
    ├── components/
    ├── lib/
    ├── .env.local
    └── package.json
```

---

## Setup — Two Terminals

### Terminal 1 — Backend (Python Flask)

```bash
cd backend
pip install -r requirements.txt
# Edit .env and add your ANTHROPIC_API_KEY
python app.py
# Server starts at http://localhost:5000
```

### Terminal 2 — Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:3000
```

---

## Environment Variables

### backend/.env
```
ANTHROPIC_API_KEY=sk-ant-...    ← Get from console.anthropic.com
USE_MOCK_DATA=false             ← Set true to demo without API credits
PORT=5000
FLASK_DEBUG=false
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## How It Works

1. User uploads PDF resume + pastes job description on the Next.js frontend
2. Frontend sends `POST /api/analyze` to Flask backend (port 5000)
3. Flask extracts text from PDF, calls Claude API 3 times:
   - `parse_resume()` → structured skills JSON
   - `parse_jd()` → required skills JSON
   - `generate_pathway()` → adaptive learning pathway
4. Response is transformed to match Next.js `AnalysisResponse` type
5. Frontend displays readiness score, skill analysis, and learning pathway

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET  | `/api/health` | Health check |
| POST | `/api/analyze` | Resume + JD → full pathway |
| POST | `/api/diagnostic/generate` | JD → 8 MCQ questions |
| POST | `/api/diagnostic/analyze` | Quiz answers → pathway |
| POST | `/api/export/pptx` | Export pathway as PowerPoint |

---

## Demo Mode (No API credits needed)

Set `USE_MOCK_DATA=true` in `backend/.env` to use pre-built mock data.
Perfect for demos and testing the UI without consuming Anthropic credits.
