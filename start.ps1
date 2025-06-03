# SSGB Engineering College Management System Start Script

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Starting SSGB Engineering College Management System" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Function to start backend
function Start-Backend {
    Write-Host "Starting Backend Server..." -ForegroundColor Yellow
    Set-Location backend
    Start-Process powershell -ArgumentList "-Command", "npm run dev" -WindowStyle Normal
    Set-Location ..
    Write-Host "Backend server started in new window" -ForegroundColor Green
}

# Function to start frontend
function Start-Frontend {
    Write-Host "Starting Frontend Development Server..." -ForegroundColor Yellow
    Set-Location frontend
    Start-Process powershell -ArgumentList "-Command", "npm start" -WindowStyle Normal
    Set-Location ..
    Write-Host "Frontend server started in new window" -ForegroundColor Green
}

# Start both servers
Start-Backend
Start-Sleep -Seconds 3
Start-Frontend

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Application URLs:" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default admin credentials:" -ForegroundColor Yellow
Write-Host "Email: admin@ssgb.edu" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
