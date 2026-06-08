@echo off
REM ==============================
REM Charlizi — 一键启动（开发 + CMS）
REM ==============================

echo [1/3] 启动 API 后端...
start "charlizi-api" cmd /c "cd /d C:\Users\Administrator\.openclaw\workspace\charlizi-api && npm start"

echo [2/3] 启动前端 Dev Server...
start "charlizi-dev" cmd /c "cd /d C:\Users\Administrator\.openclaw\workspace\charlizi-new && npm run dev"

echo [3/3] 启动 Decap CMS 本地代理...
start "decap-server" cmd /c "npx decap-server"

echo.
echo ====================================
echo   Charlizi 已启动！
echo   Frontend: http://localhost:4321
echo   CMS:      http://localhost:4321/admin.html
echo   API:      http://localhost:3001
echo ====================================
echo.
pause
