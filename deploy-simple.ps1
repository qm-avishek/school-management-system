# 🚀 SSGB College Management System - Quick Deploy Script (Fixed)
# PowerShell script for Windows deployment setup

param(
    [switch]$Help,
    [switch]$SkipTests,
    [string]$Platform = "railway"
)

function Write-Title {
    param([string]$Message)
    Write-Host ""
    Write-Host $Message -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️ $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

if ($Help) {
    Write-Title "🚀 SSGB College Management System - Deployment Helper"
    Write-Host "Usage: .\deploy-simple.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Help         Show this help message"
    Write-Host "  -SkipTests    Skip pre-deployment tests"
    Write-Host "  -Platform     Target platform (railway, render, heroku)"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\deploy-simple.ps1                    # Interactive setup"
    Write-Host "  .\deploy-simple.ps1 -Platform railway  # Deploy to Railway"
    Write-Host "  .\deploy-simple.ps1 -SkipTests        # Skip testing phase"
    exit 0
}

function Test-Prerequisites {
    Write-Title "📋 Checking Prerequisites"
    
    # Check Git
    try {
        git --version | Out-Null
        Write-Success "Git is installed"
    }
    catch {
        Write-Error "Git is not installed. Please install Git first."
        exit 1
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js $nodeVersion is installed"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js first."
        exit 1
    }
    
    # Check project structure
    if (-not (Test-Path "backend")) {
        Write-Error "Backend directory not found"
        exit 1
    }
    
    if (-not (Test-Path "frontend")) {
        Write-Error "Frontend directory not found"
        exit 1
    }
    Write-Success "Project structure verified"
}

function Setup-EnvironmentFiles {
    Write-Title "🔧 Setting Up Environment Files"
    
    # Backend .env
    if (-not (Test-Path "backend\.env")) {
        $backendEnv = @"
# Development Environment - SSGB College Backend
MONGODB_URI=mongodb://localhost:27017/ssgb_college
JWT_SECRET=dev_jwt_secret_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
"@
        $backendEnv | Out-File -FilePath "backend\.env" -Encoding utf8
        Write-Success "Backend .env file created"
    } else {
        Write-Info "Backend .env file already exists"
    }
    
    # Frontend .env
    if (-not (Test-Path "frontend\.env")) {
        $frontendEnv = @"
# Development Environment - SSGB College Frontend
REACT_APP_API_URL=/api
GENERATE_SOURCEMAP=true
"@
        $frontendEnv | Out-File -FilePath "frontend\.env" -Encoding utf8
        Write-Success "Frontend .env file created"
    } else {
        Write-Info "Frontend .env file already exists"
    }
}

function Show-Instructions {
    Write-Title "🚀 Deployment Instructions"
    
    Write-Host "Railway Deployment (Recommended)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📱 Frontend (Vercel):"
    Write-Host "1. Go to https://vercel.com"
    Write-Host "2. New Project → Import from Git"
    Write-Host "3. Select this repository"
    Write-Host "4. Set root directory: frontend"
    Write-Host "5. Add environment variable: REACT_APP_API_URL=/api"
    Write-Host ""
    Write-Host "🖥️ Backend (Railway):"
    Write-Host "1. Go to https://railway.app"
    Write-Host "2. New Project → Deploy from GitHub"
    Write-Host "3. Select this repository/backend folder"
    Write-Host "4. Add MongoDB service"
    Write-Host "5. Set environment variables:"
    Write-Host "   - MONGODB_URI=mongodb://mongo:27017/ssgb_college"
    Write-Host "   - JWT_SECRET=[generate secure secret]"
    Write-Host "   - NODE_ENV=production"
    Write-Host ""
    Write-Host "💰 Cost: Free ($5 monthly credit)" -ForegroundColor Green
}

function Show-NextSteps {
    Write-Title "🎯 Next Steps"
    
    Write-Host "Files Created:" -ForegroundColor Cyan
    Write-Host "   ✅ .env files (configure for production)"
    Write-Host ""
    
    Write-Host "GitHub Setup:" -ForegroundColor Cyan
    Write-Host "   git add ."
    Write-Host "   git commit -m 'Add deployment configuration'"
    Write-Host "   git push origin main"
    Write-Host ""
    
    Write-Host "Deploy Now:" -ForegroundColor Cyan
    Write-Host "   1. Follow platform-specific instructions above"
    Write-Host "   2. Configure environment variables"
    Write-Host "   3. Test deployed application"
    Write-Host ""
    
    Write-Success "Deployment setup complete! 🚀"
}

# Main execution
try {
    Write-Title "🚀 SSGB College Management System - Deployment Setup"
    
    Test-Prerequisites
    Setup-EnvironmentFiles
    Show-Instructions
    Show-NextSteps
    
} catch {
    Write-Error "Setup failed: $($_.Exception.Message)"
    exit 1
}
