@echo off
echo Starting Fake News Detector...
echo.

:: Start Backend API
start "Fake News Backend API" cmd /k "cd /d c:\Param\Fake news github && npm run api-server"

:: Start Frontend UI
start "Fake News Frontend" cmd /k "cd /d c:\Param\Fake news github && npm run dev"

echo Application is starting in new windows.
echo Use the browser window that opens (http://localhost:5173).
echo.
echo Press any key to close this launcher...
pause >nul
