# NexusHorizon Local Development Startup Script

Write-Host "Starting NexusHorizon Local Development..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Blue
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL connection..." -ForegroundColor Blue
try {
    # Try to connect to PostgreSQL (assumes default setup)
    $pgTest = pg_isready -h localhost -p 5432 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "Warning: Cannot connect to PostgreSQL on localhost:5432" -ForegroundColor Yellow
        Write-Host "Make sure PostgreSQL is installed and running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Warning: pg_isready not found. Please ensure PostgreSQL is installed and running" -ForegroundColor Yellow
}

Write-Host ""

# Start backend server
Write-Host "Starting Backend Server (Port 4000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm run dev"

# Wait a few seconds for backend to start
Start-Sleep -Seconds 5

# Start frontend server  
Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "Services are starting up..." -ForegroundColor Green
Write-Host "Backend GraphQL API: http://localhost:4000/graphql" -ForegroundColor Cyan
Write-Host "Frontend Application: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the services, close the PowerShell windows or press Ctrl+C in each" -ForegroundColor Yellow

Read-Host "Press Enter to exit this setup window"
