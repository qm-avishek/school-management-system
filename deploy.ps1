# 🚀 SSGB College Management System - Quick Deploy Script
# PowerShell script for Windows deployment setup

param(
    [switch]$Help,
    [switch]$SkipTests,
    [string]$Platform = "railway" # railway, render, or heroku
)

# Colors for output
$Colors = @{
    Green = "`e[32m"
    Red = "`e[31m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Magenta = "`e[35m"
    Cyan = "`e[36m"
    Reset = "`e[0m"
    Bold = "`e[1m"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "Reset")
    Write-Host "$($Colors[$Color])$Message$($Colors.Reset)"
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "🔧 $Message" "Magenta"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠️ $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ️ $Message" "Blue"
}

function Write-Title {
    param([string]$Message)
    Write-Host ""
    Write-ColorOutput $Message "Bold"
    Write-Host ""
}

if ($Help) {
    Write-Title "🚀 SSGB College Management System - Deployment Helper"
    Write-Host @"
Usage: .\deploy.ps1 [options]

Options:
  -Help         Show this help message
  -SkipTests    Skip pre-deployment tests
  -Platform     Target platform (railway, render, heroku)

Examples:
  .\deploy.ps1                    # Interactive setup
  .\deploy.ps1 -Platform railway  # Deploy to Railway
  .\deploy.ps1 -SkipTests        # Skip testing phase

Platforms:
  railway   - Railway.app (Recommended, Free $5/month)
  render    - Render.com (Free tier with limitations)
  heroku    - Heroku (Paid plans only)

"@
    exit 0
}

function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Test-Prerequisites {
    Write-Title "📋 Checking Prerequisites"
    
    # Check Git
    if (-not (Test-Command "git")) {
        Write-Error "Git is not installed. Please install Git first."
        Write-Info "Download from: https://git-scm.com/"
        exit 1
    }
    Write-Success "Git is installed"
    
    # Check Node.js
    if (-not (Test-Command "node")) {
        Write-Error "Node.js is not installed. Please install Node.js first."
        Write-Info "Download from: https://nodejs.org/"
        exit 1
    }
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion is installed"
    
    # Check npm
    if (-not (Test-Command "npm")) {
        Write-Error "npm is not available"
        exit 1
    }
    Write-Success "npm is available"
    
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

function Test-Builds {
    if ($SkipTests) {
        Write-Info "Skipping tests as requested"
        return
    }
    
    Write-Title "🧪 Testing Builds"
    
    # Test backend dependencies
    Write-Step "Installing backend dependencies..."
    Set-Location "backend"
    try {
        npm install
        Write-Success "Backend dependencies installed"
    }
    catch {
        Write-Error "Failed to install backend dependencies"
        exit 1
    }
    Set-Location ".."
    
    # Test frontend dependencies
    Write-Step "Installing frontend dependencies..."
    Set-Location "frontend"
    try {
        npm install
        Write-Success "Frontend dependencies installed"
    }
    catch {
        Write-Error "Failed to install frontend dependencies"
        exit 1
    }
    
    # Test frontend build
    Write-Step "Testing frontend build..."
    try {
        npm run build
        Write-Success "Frontend build successful"
    }
    catch {
        Write-Warning "Frontend build failed - check for errors"
    }
    Set-Location ".."
}

function Show-DeploymentInstructions {
    Write-Title "🚀 Deployment Instructions"
    
    switch ($Platform.ToLower()) {
        "railway" {
            Write-ColorOutput "Railway Deployment (Recommended)" "Cyan"
            Write-Host @"

📱 Frontend (Vercel):
1. Go to https://vercel.com
2. New Project → Import from Git
3. Select this repository
4. Set root directory: frontend
5. Add environment variable: REACT_APP_API_URL=/api

🖥️ Backend (Railway):
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select this repository/backend folder
4. Add MongoDB service
5. Set environment variables:
   - MONGODB_URI=mongodb://mongo:27017/ssgb_college
   - JWT_SECRET=$(New-Guid)
   - NODE_ENV=production

💰 Cost: Free ($5 monthly credit)
"@
        }
        "render" {
            Write-ColorOutput "Render Deployment" "Cyan"
            Write-Host @"

🌐 Full-Stack (Render):
1. Go to https://render.com
2. New Web Service → Connect repository
3. Select this repository
4. Set build/start commands for both frontend and backend
5. Add PostgreSQL database (free tier)

💰 Cost: Free (with limitations)
"@
        }
        default {
            Write-ColorOutput "General Deployment Steps" "Cyan"
            Write-Host @"

1. 📚 Push code to GitHub repository
2. 🖥️ Deploy backend to cloud platform
3. 📱 Deploy frontend to Vercel/Netlify
4. 🔗 Configure API proxy in frontend
5. 🔧 Set environment variables
6. 🧪 Test the deployed application

"@
        }
    }
}

function Generate-DeploymentFiles {
    Write-Title "📄 Generating Deployment Files"
    
    # Create production environment template
    $prodEnvTemplate = @"
# Production Environment Variables
# Copy and customize for your deployment platform

# Backend
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=$(New-Guid)
NODE_ENV=production
PORT=5000

# Frontend  
REACT_APP_API_URL=/api
GENERATE_SOURCEMAP=false
"@
    
    $prodEnvTemplate | Out-File -FilePath ".env.production.template" -Encoding utf8
    Write-Success "Production environment template created"
    
    # Create deployment checklist
    $deploymentChecklist = @"
# 🚀 Deployment Checklist

## Pre-deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Build tests passed

## Platform Setup
- [ ] Backend deployed to $(($Platform -replace '^(.)','$1').ToUpper())
- [ ] Frontend deployed to Vercel
- [ ] Database configured
- [ ] Custom domain (optional)

## Post-deployment
- [ ] Health check endpoint working
- [ ] Authentication flow tested
- [ ] All features functional
- [ ] Error monitoring setup

## URLs
- Frontend: https://yourapp.vercel.app
- Backend: https://yourapp.$(($Platform.ToLower())).app
- Admin Login: admin@ssgb.edu / admin123

Generated: $(Get-Date)
"@
    
    $deploymentChecklist | Out-File -FilePath "DEPLOYMENT_CHECKLIST.md" -Encoding utf8
    Write-Success "Deployment checklist created"
}

function Show-NextSteps {
    Write-Title "🎯 Next Steps"
    
    Write-ColorOutput "Files Created:" "Cyan"
    Write-Host "   ✅ .env files (configure for production)"
    Write-Host "   ✅ .env.production.template"
    Write-Host "   ✅ DEPLOYMENT_CHECKLIST.md"
    Write-Host ""
    
    Write-ColorOutput "GitHub Setup:" "Cyan"
    Write-Host "   git add ."
    Write-Host "   git commit -m 'Add deployment configuration'"
    Write-Host "   git push origin main"
    Write-Host ""
    
    Write-ColorOutput "Deploy Now:" "Cyan"
    Write-Host "   1. Follow platform-specific instructions above"
    Write-Host "   2. Configure environment variables"
    Write-Host "   3. Test deployed application"
    Write-Host ""
    
    Write-ColorOutput "Resources:" "Yellow"
    Write-Host "   📚 DEPLOYMENT.md - Full documentation"
    Write-Host "   🔧 .github/workflows/ci-cd.yml - Automated deployment"
    Write-Host "   📋 DEPLOYMENT_CHECKLIST.md - Step-by-step guide"
    Write-Host ""
    
    Write-Success "Deployment setup complete! 🚀"
}

# Main execution
try {
    Write-Title "🚀 SSGB College Management System - Deployment Setup"
    
    Test-Prerequisites
    Setup-EnvironmentFiles
    Test-Builds
    Generate-DeploymentFiles
    Show-DeploymentInstructions
    Show-NextSteps
    
} catch {
    Write-Error "Setup failed: $($_.Exception.Message)"
    exit 1
}
