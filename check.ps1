# Simple System Check for SSGB Engineering College Management System

Write-Host "SSGB College Management System - Quick Verification" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js: Not found" -ForegroundColor Red
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm: Not found" -ForegroundColor Red
}

# Check project structure
Write-Host "`nProject Structure:" -ForegroundColor Yellow
$paths = @("backend", "frontend", "README.md", "backend\package.json", "frontend\package.json")
foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "  $path - OK" -ForegroundColor Green
    } else {
        Write-Host "  $path - Missing" -ForegroundColor Red
    }
}

# Check ports
Write-Host "`nServer Status:" -ForegroundColor Yellow

try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "  Backend (port 5000) - Running" -ForegroundColor Green
} catch {
    Write-Host "  Backend (port 5000) - Not running" -ForegroundColor Red
}

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3
    Write-Host "  Frontend (port 3000) - Running" -ForegroundColor Green
} catch {
    Write-Host "  Frontend (port 3000) - Not running" -ForegroundColor Red
}

Write-Host "`nAccess URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend: http://localhost:5000" -ForegroundColor White
Write-Host "  API Health: http://localhost:5000/api/health" -ForegroundColor White

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. Configure database (see DATABASE_SETUP.md)" -ForegroundColor White
Write-Host "  2. Seed admin user: cd backend; npm run seed" -ForegroundColor White
Write-Host "  3. Login with admin@ssgb.edu / admin123" -ForegroundColor White

Write-Host "`nSystem check complete!" -ForegroundColor Green
