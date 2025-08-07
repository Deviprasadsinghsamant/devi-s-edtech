@echo off
echo Starting NexusHorizon Local Development...
echo.

echo Starting Backend Server...
start "NexusHorizon Backend" cmd /k "cd /d server && npm run dev"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "NexusHorizon Frontend" cmd /k "cd /d client && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
