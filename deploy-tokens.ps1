# Simple Deployment Script with Hardcoded Tokens
Write-Host "=== Simple Deployment with Hardcoded Tokens ===" -ForegroundColor Green

# Set tokens as environment variables
$env:VERCEL_TOKEN = "Wcy6d56q7FEBKup6677RqcwP"
$env:VERCEL_ORG_ID = "avishek-kumars-projects"
$env:VERCEL_PROJECT_ID = "prj_RLZw3QVlINTR6P6nrlUTdEh7y6fL"
$env:RAILWAY_TOKEN = "2c291c17-9581-44f9-89a0-0da65976bead"

$PROJECT_ROOT = "d:\Qualminds\school-management-system"
Set-Location $PROJECT_ROOT

Write-Host "Project Directory: $PROJECT_ROOT" -ForegroundColor Yellow

# Deploy Backend to Railway
Write-Host "`n=== Deploying Backend to Railway ===" -ForegroundColor Cyan
Set-Location "$PROJECT_ROOT\backend"

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Starting Railway deployment..." -ForegroundColor Yellow
Write-Host "Railway Token: $env:RAILWAY_TOKEN" -ForegroundColor Gray

# Use railway CLI with environment token
railway up
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "Backend deployment failed" -ForegroundColor Red
}

# Deploy Frontend to Vercel
Write-Host "`n=== Deploying Frontend to Vercel ===" -ForegroundColor Cyan
Set-Location "$PROJECT_ROOT\frontend"

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Building frontend..." -ForegroundColor Yellow
$env:REACT_APP_API_URL = "https://sms-service.up.railway.app/api"
npm run build

Write-Host "Starting Vercel deployment..." -ForegroundColor Yellow
Write-Host "Vercel Token: $env:VERCEL_TOKEN" -ForegroundColor Gray

# Deploy to Vercel with token
vercel --prod --yes
if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "Frontend deployment failed" -ForegroundColor Red
}

# Summary
Write-Host "`n=== Deployment Summary ===" -ForegroundColor Green
Write-Host "Backend: Railway - Check Railway dashboard for URL" -ForegroundColor Cyan
Write-Host "Frontend: Vercel - Check Vercel dashboard for URL" -ForegroundColor Cyan
Write-Host "Login Credentials: admin@ssgb.edu / admin123" -ForegroundColor Yellow

Set-Location $PROJECT_ROOT
