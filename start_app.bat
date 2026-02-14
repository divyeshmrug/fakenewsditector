@echo off
TITLE Axiant Intelligence Launcher [DIAGNOSTIC]
COLOR 0A
cd /d "%~dp0"

echo ===================================================
echo   AXIANT INTELLIGENCE - DIAGNOSTIC LAUNCHER
echo ===================================================
echo.

:: 1. Cleanup
echo [1/5] Cleaning up old processes...
taskkill /F /IM node.exe >nul 2>&1
echo Done.

:: 2. Dependencies Check
if not exist "node_modules" (
    echo [ERROR] node_modules not found! Installing...
    call npm install
)

:: 3. Start Backend
echo [2/5] Starting Backend API (Port 3001)...
start "Backend API (DO NOT CLOSE)" cmd /k "npm run api-server || (echo CRASHED && pause)"

:: 4. Health Check Loop
echo [3/5] Waiting for Backend Connection...
set RETRY_COUNT=0
:CheckLoop
timeout /t 2 >nul
curl -s http://localhost:3001/health >nul
if %errorlevel% equ 0 goto BackendReady

set /a RETRY_COUNT+=1
if %RETRY_COUNT% geq 10 (
    echo [ERROR] Backend failed to start in 20 seconds.
    echo Please check the other black window for errors.
    pause
    exit
)
echo    ... Still waiting (%RETRY_COUNT%/10)...
goto CheckLoop

:BackendReady
echo.
echo [SUCCESS] Backend is ONLINE!
echo.

:: 5. Start Frontend
echo [4/5] Starting Frontend Server...
:: Using Direct Vite Call to bypass NPM script policies if needed
start "Frontend UI (DO NOT CLOSE)" cmd /k "npx vite --host || (echo FRONTEND CRASHED && pause)"

:: 6. Launch Browser
echo [5/5] Launching Browser...
timeout /t 5 >nul
start http://localhost:5173/

echo.
echo ===================================================
echo   SYSTEM IS LIVE!
echo   If the browser did not open, go to:
echo   http://localhost:5173
echo.
echo   KEEP THE BLACK WINDOWS OPEN!
echo ===================================================
pause
