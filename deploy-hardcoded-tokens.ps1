# School Management System - Hardcoded Token Deployment Script
# This script deploys the application using hardcoded tokens for immediate deployment

Write-Host "=== School Management System Deployment with Hardcoded Tokens ===" -ForegroundColor Green

# Hardcoded Configuration
# Vercel Configuration
$VERCEL_TOKEN = "Wcy6d56q7FEBKup6677RqcwP"
$VERCEL_PROJECT_ID = "prj_RLZw3QVlINTR6P6nrlUTdEh7y6fL"
$VERCEL_ORG_ID = "avishek-kumars-projects"

# Railway Configuration
$RAILWAY_TOKEN = "2c291c17-9581-44f9-89a0-0da65976bead"
$RAILWAY_PROJECT_ID = "64c7d8db-5b5c-4f0b-82e8-32d7e911a874"
$RAILWAY_SERVICE_ID = "8a40dbd6-f389-4f50-b53e-9689a4977c91"

# Set working directory
$PROJECT_ROOT = "d:\Qualminds\school-management-system"
Set-Location $PROJECT_ROOT

Write-Host "Working Directory: $PROJECT_ROOT" -ForegroundColor Yellow

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Install required CLI tools if not present
Write-Host "`n=== Installing Required CLI Tools ===" -ForegroundColor Cyan

# Install Vercel CLI
if (-not (Test-Command "vercel")) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Vercel CLI already installed" -ForegroundColor Green
}

# Install Railway CLI
if (-not (Test-Command "railway")) {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Railway CLI" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Railway CLI already installed" -ForegroundColor Green
}

# Deploy Backend to Railway
Write-Host "`n=== Deploying Backend to Railway ===" -ForegroundColor Cyan

Set-Location "$PROJECT_ROOT\backend"

# Check if backend directory exists and has required files
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found in backend directory" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "server.js")) {
    Write-Host "Error: server.js not found in backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "Deploying backend to Railway..." -ForegroundColor Yellow

# Set Railway environment variables
$env:RAILWAY_TOKEN = $RAILWAY_TOKEN

# Login to Railway
Write-Host "Logging into Railway..." -ForegroundColor Yellow
railway login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to login to Railway" -ForegroundColor Red
    exit 1
}

# Link to Railway project and service
Write-Host "Linking to Railway project..." -ForegroundColor Yellow
railway link $RAILWAY_PROJECT_ID
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to link Railway project" -ForegroundColor Red
    exit 1
}

# Deploy to Railway
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
railway up
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to deploy backend to Railway" -ForegroundColor Red
    exit 1
}

Write-Host "Backend deployed successfully to Railway!" -ForegroundColor Green

# Get Railway backend URL
$RAILWAY_BACKEND_URL = railway url
Write-Host "Backend URL: $RAILWAY_BACKEND_URL" -ForegroundColor Green

# Deploy Frontend to Vercel
Write-Host "`n=== Deploying Frontend to Vercel ===" -ForegroundColor Cyan

Set-Location "$PROJECT_ROOT\frontend"

# Check if frontend directory exists and has required files
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found in frontend directory" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "src\App.js")) {
    Write-Host "Error: src\App.js not found in frontend directory" -ForegroundColor Red
    exit 1
}

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Set environment variable for backend URL
$env:REACT_APP_API_URL = $RAILWAY_BACKEND_URL

Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build frontend" -ForegroundColor Red
    exit 1
}

Write-Host "Deploying frontend to Vercel..." -ForegroundColor Yellow

# Set Vercel environment variables
$env:VERCEL_TOKEN = $VERCEL_TOKEN
$env:VERCEL_ORG_ID = $VERCEL_ORG_ID
$env:VERCEL_PROJECT_ID = $VERCEL_PROJECT_ID

# Deploy using Vercel CLI
vercel --token $VERCEL_TOKEN --prod --yes
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to deploy frontend to Vercel" -ForegroundColor Red
    exit 1
}

Write-Host "Frontend deployed successfully to Vercel!" -ForegroundColor Green

# Get deployment URLs
Write-Host "`n=== Deployment Summary ===" -ForegroundColor Green
Write-Host "Backend (Railway): $RAILWAY_BACKEND_URL" -ForegroundColor Cyan
Write-Host "Frontend (Vercel): Check Vercel dashboard for URL" -ForegroundColor Cyan

# Test backend health
Write-Host "`n=== Testing Backend Health ===" -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$RAILWAY_BACKEND_URL/api/health" -Method GET -ErrorAction Stop
    Write-Host "Backend health check passed: $($healthResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Backend health check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "This might be normal if the backend is still starting up" -ForegroundColor Yellow
}

Write-Host "`n=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "Your School Management System has been deployed successfully!" -ForegroundColor Green
Write-Host "Backend: $RAILWAY_BACKEND_URL" -ForegroundColor Cyan
Write-Host "Frontend: Check your Vercel dashboard for the frontend URL" -ForegroundColor Cyan

# Return to project root
Set-Location $PROJECT_ROOT
