@echo off
echo ========================================
echo  Starting SkillPath - Full Stack
echo ========================================
echo  Backend  → http://localhost:5000
echo  Frontend → http://localhost:3000
echo ========================================
start "SkillPath Backend" cmd /k "cd backend && python app.py"
timeout /t 4 /nobreak >nul
start "SkillPath Frontend" cmd /k "cd frontend && npm run dev"
echo Both servers starting...
echo Open http://localhost:3000 in your browser
pause
