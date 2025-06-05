# Vercel Setup and Deployment Script
# Comprehensive script to help set up Vercel deployment for the School Management System

param(
    [switch]$SetupOnly,
    [switch]$DeployOnly,
    [string]$Environment = "production"
)

Write-Host "🚀 Vercel Setup and Deployment Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Function to check if Vercel CLI is installed
function Test-VercelCLI {
    try {
        $vercelVersion = vercel --version 2>$null
        if ($vercelVersion) {
            Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ Vercel CLI not found" -ForegroundColor Red
        return $false
    }
}

# Function to install Vercel CLI
function Install-VercelCLI {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    try {
        npm install -g vercel
        Write-Host "✅ Vercel CLI installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}

# Function to check project structure
function Test-ProjectStructure {
    Write-Host "📁 Checking project structure..." -ForegroundColor Yellow
    
    $backend = Test-Path "backend"
    $frontend = Test-Path "frontend"
    $backendVercel = Test-Path "backend/vercel.json"
    $frontendVercel = Test-Path "frontend/vercel.json"
    $backendPackage = Test-Path "backend/package.json"
    $frontendPackage = Test-Path "frontend/package.json"
    
    if ($backend -and $frontend -and $backendVercel -and $frontendVercel -and $backendPackage -and $frontendPackage) {
        Write-Host "✅ Project structure is correct" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Missing required files or directories" -ForegroundColor Red
        Write-Host "Required: backend/, frontend/, backend/vercel.json, frontend/vercel.json" -ForegroundColor Yellow
        return $false
    }
}

# Function to display setup instructions
function Show-SetupInstructions {
    Write-Host "`n📋 Vercel Setup Instructions" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    Write-Host "`n1. Create Vercel Account:" -ForegroundColor Yellow
    Write-Host "   • Go to https://vercel.com"
    Write-Host "   • Sign up with your GitHub account"
    Write-Host "   • Grant necessary permissions"
    
    Write-Host "`n2. Import Projects:" -ForegroundColor Yellow
    Write-Host "   • Click 'New Project' in Vercel dashboard"
    Write-Host "   • Import from GitHub repository"
    Write-Host "   • Create TWO projects:"
    Write-Host "     - Backend: Set root directory to 'backend'"
    Write-Host "     - Frontend: Set root directory to 'frontend'"
    
    Write-Host "`n3. Get Required IDs:" -ForegroundColor Yellow
    Write-Host "   • Organization ID: Settings → General → Organization ID"
    Write-Host "   • Project IDs: Each project → Settings → General → Project ID"
    Write-Host "   • API Token: Settings → Tokens → Create Token"
    
    Write-Host "`n4. Set GitHub Secrets:" -ForegroundColor Yellow
    Write-Host "   • Go to GitHub repository → Settings → Secrets"
    Write-Host "   • Add these secrets:"
    Write-Host "     - VERCEL_TOKEN: Your API token"
    Write-Host "     - VERCEL_ORG_ID: Your organization ID"
    Write-Host "     - VERCEL_BACKEND_PROJECT_ID: Backend project ID"
    Write-Host "     - VERCEL_FRONTEND_PROJECT_ID: Frontend project ID"
    
    Write-Host "`n5. Configure Environment Variables:" -ForegroundColor Yellow
    Write-Host "   Backend (Vercel Dashboard):"
    Write-Host "     - MONGODB_URI: Your MongoDB Atlas connection string"
    Write-Host "     - JWT_SECRET: Strong secret for JWT tokens"
    Write-Host "     - NODE_ENV: production"
    Write-Host "     - CORS_ORIGIN: Your frontend domain"
    Write-Host "`n   Frontend (Vercel Dashboard):"
    Write-Host "     - REACT_APP_API_URL: Your backend domain"
    Write-Host "     - GENERATE_SOURCEMAP: false"
}

# Function to deploy to Vercel
function Deploy-ToVercel {
    param([string]$Service)
    
    Write-Host "`n🚀 Deploying $Service to Vercel..." -ForegroundColor Yellow
    
    $servicePath = if ($Service -eq "backend") { "backend" } else { "frontend" }
    
    if (!(Test-Path $servicePath)) {
        Write-Host "❌ $servicePath directory not found" -ForegroundColor Red
        return $false
    }
    
    Push-Location $servicePath
    
    try {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm install
        
        if ($Service -eq "frontend") {
            Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
            npm run build
        }
        
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
        if ($Environment -eq "production") {
            vercel --prod --yes
        } else {
            vercel --yes
        }
        
        Write-Host "✅ $Service deployed successfully!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        Pop-Location
    }
}

# Function to test deployment
function Test-Deployment {
    Write-Host "`n🧪 Testing deployment..." -ForegroundColor Yellow
    
    Write-Host "📋 Manual testing steps:" -ForegroundColor Cyan
    Write-Host "1. Check backend health endpoint: /health"
    Write-Host "2. Test frontend loading and navigation"
    Write-Host "3. Try login with: admin@ssgb.edu / admin123"
    Write-Host "4. Verify API connectivity between frontend and backend"
    Write-Host "5. Check browser console for any errors"
}

# Main execution
Write-Host "`nStarting Vercel setup process..." -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Test-VercelCLI)) {
    $install = Read-Host "Vercel CLI not found. Install it? (y/n)"
    if ($install -eq "y" -or $install -eq "Y") {
        Install-VercelCLI
    } else {
        Write-Host "❌ Vercel CLI required. Exiting..." -ForegroundColor Red
        exit 1
    }
}

# Check project structure
if (!(Test-ProjectStructure)) {
    Write-Host "❌ Project structure check failed. Please ensure you're in the correct directory." -ForegroundColor Red
    exit 1
}

# Show setup instructions if requested or if not deploying only
if ($SetupOnly -or !$DeployOnly) {
    Show-SetupInstructions
    
    if ($SetupOnly) {
        Write-Host "`n✅ Setup instructions displayed. Run with -DeployOnly when ready to deploy." -ForegroundColor Green
        exit 0
    }
    
    $continue = Read-Host "`nHave you completed the setup steps above? Continue with deployment? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Setup incomplete. Run this script again when ready." -ForegroundColor Yellow
        exit 0
    }
}

# Deploy if requested
if ($DeployOnly -or !$SetupOnly) {
    Write-Host "`n🚀 Starting deployment process..." -ForegroundColor Cyan
    
    # Deploy backend
    $backendSuccess = Deploy-ToVercel "backend"
    
    # Deploy frontend
    $frontendSuccess = Deploy-ToVercel "frontend"
    
    # Summary
    Write-Host "`n📊 Deployment Summary:" -ForegroundColor Cyan
    Write-Host "Backend: $(if ($backendSuccess) { '✅ Success' } else { '❌ Failed' })"
    Write-Host "Frontend: $(if ($frontendSuccess) { '✅ Success' } else { '❌ Failed' })"
    
    if ($backendSuccess -and $frontendSuccess) {
        Write-Host "`n🎉 Deployment completed successfully!" -ForegroundColor Green
        Test-Deployment
    } else {
        Write-Host "`n❌ Some deployments failed. Check the errors above." -ForegroundColor Red
    }
}

Write-Host "`n📚 For more information, see: VERCEL_MIGRATION_COMPLETE.md" -ForegroundColor Cyan
Write-Host "🔗 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
