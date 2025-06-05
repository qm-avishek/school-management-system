# Deployment Script with Hardcoded Tokens
# This script uses hardcoded tokens for immediate deployment

param(
    [string]$Service = "both",  # "frontend", "backend", or "both"
    [switch]$Help
)

if ($Help) {
    Write-Host "🚀 Hardcoded Token Deployment Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\deploy-hardcoded.ps1 [-Service frontend|backend|both]"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\deploy-hardcoded.ps1                    # Deploy both frontend and backend"
    Write-Host "  .\deploy-hardcoded.ps1 -Service frontend  # Deploy only frontend"
    Write-Host "  .\deploy-hardcoded.ps1 -Service backend   # Deploy only backend"
    exit 0
}

# Hardcoded Tokens - Ready for immediate deployment
$VERCEL_TOKEN = "gG2dmC2cNWsKKR4eCTBSHKx2"
$VERCEL_ORG_ID = "team_a3z5bggXVgLrY4RYW6xE0qRq"
$VERCEL_PROJECT_ID = "school-management-frontend-kappa"
$RAILWAY_TOKEN = "f635bff1-bf8c-4421-85e9-d20e6b8bef3e"
$RAILWAY_PROJECT_ID = "7a1e7e7e-5e5e-4e5e-8e5e-5e5e5e5e5e5e"
$RAILWAY_SERVICE_ID = "8a40dbd6-f389-4f50-b53e-9689a4977c91"

function Write-Title {
    param([string]$Message)
    Write-Host "`n$Message" -ForegroundColor Yellow -BackgroundColor DarkBlue
    Write-Host ("=" * $Message.Length) -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Test-Prerequisites {
    Write-Title "🔍 Checking Prerequisites"
    
    $allGood = $true
    
    # Check if Node.js is installed
    try {
        $nodeVersion = node --version
        Write-Success "Node.js is installed: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed or not in PATH"
        $allGood = $false
    }
    
    # Check if npm is installed
    try {
        $npmVersion = npm --version
        Write-Success "npm is installed: $npmVersion"
    }
    catch {
        Write-Error "npm is not installed or not in PATH"
        $allGood = $false
    }
    
    # Check if Vercel CLI is installed
    try {
        $vercelVersion = vercel --version
        Write-Success "Vercel CLI is installed: $vercelVersion"
    }
    catch {
        Write-Warning "Vercel CLI is not installed. Installing..."
        try {
            npm install -g vercel
            Write-Success "Vercel CLI installed successfully"
        }
        catch {
            Write-Error "Failed to install Vercel CLI"
            $allGood = $false
        }
    }
    
    # Check if Railway CLI is installed
    try {
        $railwayVersion = railway --version
        Write-Success "Railway CLI is installed: $railwayVersion"
    }
    catch {
        Write-Warning "Railway CLI is not installed. Installing..."
        try {
            npm install -g @railway/cli
            Write-Success "Railway CLI installed successfully"
        }
        catch {
            Write-Error "Failed to install Railway CLI"
            $allGood = $false
        }
    }
    
    return $allGood
}

function Deploy-Frontend {
    Write-Title "🌐 Deploying Frontend to Vercel"
    
    try {
        Push-Location "frontend"
        
        Write-Info "Installing frontend dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        
        Write-Info "Building frontend..."
        npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "npm run build failed"
        }
        
        Write-Info "Deploying to Vercel..."
        $env:VERCEL_TOKEN = $VERCEL_TOKEN
        $env:VERCEL_ORG_ID = $VERCEL_ORG_ID
        $env:VERCEL_PROJECT_ID = $VERCEL_PROJECT_ID
        
        vercel --prod --token $VERCEL_TOKEN --scope $VERCEL_ORG_ID
        if ($LASTEXITCODE -ne 0) {
            throw "Vercel deployment failed"
        }
        
        Write-Success "Frontend deployed successfully!"
        Write-Info "Frontend URL: https://$VERCEL_PROJECT_ID.vercel.app"
        
        return $true
    }
    catch {
        Write-Error "Frontend deployment error: $($_.Exception.Message)"
        return $false
    }
    finally {
        Pop-Location
    }
}

function Deploy-Backend {
    Write-Title "🔧 Deploying Backend to Railway"
    
    try {
        Push-Location "backend"
        
        Write-Info "Installing backend dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        
        Write-Info "Deploying to Railway..."
        $env:RAILWAY_TOKEN = $RAILWAY_TOKEN
        
        # Login to Railway with token
        railway login --token $RAILWAY_TOKEN
        if ($LASTEXITCODE -ne 0) {
            throw "Railway login failed"
        }
        
        # Link to the correct project and service
        railway link $RAILWAY_PROJECT_ID --service $RAILWAY_SERVICE_ID
        if ($LASTEXITCODE -ne 0) {
            throw "Railway link failed"
        }
        
        # Deploy
        railway up
        if ($LASTEXITCODE -ne 0) {
            throw "Railway deployment failed"
        }
        
        Write-Success "Backend deployed successfully!"
        Write-Info "Backend URL: https://sms-service.up.railway.app"
        
        return $true
    }
    catch {
        Write-Error "Backend deployment error: $($_.Exception.Message)"
        return $false
    }
    finally {
        Pop-Location
    }
}

function Test-Deployment {
    Write-Title "🧪 Testing Deployment"
    
    Write-Info "Testing backend health..."
    try {
        $healthResponse = Invoke-RestMethod -Uri "https://sms-service.up.railway.app/health" -Method GET
        Write-Success "Backend is healthy: $($healthResponse.status)"
    }
    catch {
        Write-Warning "Backend health check failed: $($_.Exception.Message)"
    }
    
    Write-Info "Frontend should be accessible at: https://$VERCEL_PROJECT_ID.vercel.app"
    Write-Info "Backend should be accessible at: https://sms-service.up.railway.app"
    
    Write-Host ""
    Write-Host "🔐 Test Login Credentials:" -ForegroundColor Yellow
    Write-Host "Email: admin@ssgb.edu"
    Write-Host "Password: admin123"
}

# Main execution
Write-Title "🚀 School Management System - Hardcoded Token Deployment"

Write-Info "Using hardcoded tokens for deployment:"
Write-Info "Vercel Project ID: $VERCEL_PROJECT_ID"
Write-Info "Vercel Org ID: $VERCEL_ORG_ID"
Write-Info "Railway Project ID: $RAILWAY_PROJECT_ID"

if (!(Test-Prerequisites)) {
    Write-Error "Prerequisites check failed. Please fix the issues above."
    exit 1
}

$frontendSuccess = $false
$backendSuccess = $false

if ($Service -eq "frontend" -or $Service -eq "both") {
    $frontendSuccess = Deploy-Frontend
}

if ($Service -eq "backend" -or $Service -eq "both") {
    $backendSuccess = Deploy-Backend
}

# Summary
Write-Title "📊 Deployment Summary"

if ($Service -eq "both") {
    Write-Host "Frontend: $(if ($frontendSuccess) { '✅ Success' } else { '❌ Failed' })"
    Write-Host "Backend: $(if ($backendSuccess) { '✅ Success' } else { '❌ Failed' })"
    
    if ($frontendSuccess -and $backendSuccess) {
        Write-Success "Both services deployed successfully!"
        Test-Deployment
    }
    elseif ($frontendSuccess -or $backendSuccess) {
        Write-Warning "Partial deployment completed. Check failed service logs above."
    }
    else {
        Write-Error "Both deployments failed. Check the errors above."
    }
}
elseif ($Service -eq "frontend") {
    if ($frontendSuccess) {
        Write-Success "Frontend deployed successfully!"
    }
    else {
        Write-Error "Frontend deployment failed."
    }
}
elseif ($Service -eq "backend") {
    if ($backendSuccess) {
        Write-Success "Backend deployed successfully!"
    }
    else {
        Write-Error "Backend deployment failed."
    }
}

Write-Host ""
Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "• Frontend: https://$VERCEL_PROJECT_ID.vercel.app"
Write-Host "• Backend: https://sms-service.up.railway.app"
Write-Host "• Railway Dashboard: https://railway.app/dashboard"
Write-Host "• Vercel Dashboard: https://vercel.com/dashboard"
