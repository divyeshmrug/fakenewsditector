# Script to run the Fake News Detection App
Write-Host "Starting Fake News Detection App..." -ForegroundColor Cyan

# Ensure Node.js is in PATH
$env:Path = "C:\Program Files\nodejs;" + $env:Path

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the API server in a new window
Write-Host "Starting API Server..." -ForegroundColor Green
Start-Process "cmd" -ArgumentList "/c npm run api-server"

# Wait for API server to initialize
Start-Sleep -Seconds 3

# Start the dev server
Write-Host "Starting Frontend... Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"
npm run dev
