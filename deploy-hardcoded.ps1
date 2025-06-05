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

# Hardcoded tokens
$VERCEL_TOKEN = "Wcy6d56q7FEBKup6677RqcwP"
$VERCEL_PROJECT_ID = "prj_RLZw3QVlINTR6P6nrlUTdEh7y6fL"
$VERCEL_ORG_ID = "avishek-kumars-projects"
$RAILWAY_PROJECT_TOKEN = "2c291c17-9581-44f9-89a0-0da65976bead"
$RAILWAY_PROJECT_ID = "64c7d8db-5b5c-4f0b-82e8-32d7e911a874"

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

function Test-Prerequisites {
    Write-Title "📋 Checking Prerequisites"
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js $nodeVersion is installed"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js first."
        return $false
    }
    
    # Check if Vercel CLI is installed
    try {
        $vercelVersion = vercel --version 2>$null
        Write-Success "Vercel CLI is installed: $vercelVersion"
    }
    catch {
        Write-Warning "Vercel CLI not found. Installing..."
        try {
            npm install -g vercel
            Write-Success "Vercel CLI installed successfully"
        }
        catch {
            Write-Error "Failed to install Vercel CLI"
            return $false
        }
    }
    
    # Check Railway CLI for backend deployment
    try {
        $railwayVersion = railway --version 2>$null
        Write-Success "Railway CLI is installed: $railwayVersion"
    }
    catch {
        Write-Warning "Railway CLI not found. Installing..."
        try {
            npm install -g @railway/cli
            Write-Success "Railway CLI installed successfully"
        }
        catch {
            Write-Error "Failed to install Railway CLI"
            return $false
        }
    }
    
    return $true
}

function Deploy-Frontend {
    Write-Title "🚀 Deploying Frontend to Vercel"
    
    if (!(Test-Path "frontend")) {
        Write-Error "Frontend directory not found"
        return $false
    }
    
    Push-Location "frontend"
    
    try {
        # Set environment variables
        $env:VERCEL_TOKEN = $VERCEL_TOKEN
        $env:VERCEL_ORG_ID = $VERCEL_ORG_ID
        $env:VERCEL_PROJECT_ID = $VERCEL_PROJECT_ID
        
        Write-Info "Installing dependencies..."
        npm install
        
        Write-Info "Building frontend..."
        npm run build
        
        Write-Info "Deploying to Vercel..."
        
        # Create vercel.json if it doesn't exist
        if (!(Test-Path "vercel.json")) {
            $vercelConfig = @{
                "version" = 2
                "builds" = @(
                    @{
                        "src" = "build/**"
                        "use" = "@vercel/static"
                    }
                )
                "routes" = @(
                    @{
                        "src" = "/(.*)"
                        "dest" = "/build/$1"
                    }
                )
                "env" = @{
                    "REACT_APP_API_URL" = "https://sms-service.up.railway.app/api"
                    "GENERATE_SOURCEMAP" = "false"
                }
            } | ConvertTo-Json -Depth 5
            
            $vercelConfig | Out-File -FilePath "vercel.json" -Encoding utf8
            Write-Success "Created vercel.json configuration"
        }
        
        # Deploy using vercel command with token
        $deployResult = vercel --prod --token $VERCEL_TOKEN --scope $VERCEL_ORG_ID --yes 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Frontend deployed successfully to Vercel!"
            Write-Info "Frontend URL: https://$VERCEL_PROJECT_ID.vercel.app"
        }
        else {
            Write-Error "Frontend deployment failed"
            Write-Host $deployResult
            return $false
        }
    }
    catch {
        Write-Error "Frontend deployment error: $($_.Exception.Message)"
        return $false
    }
    finally {
        Pop-Location
    }
    
    return $true
}

function Deploy-Backend {
    Write-Title "🚀 Deploying Backend to Railway"
    
    if (!(Test-Path "backend")) {
        Write-Error "Backend directory not found"
        return $false
    }
    
    Push-Location "backend"
    
    try {
        # Set Railway environment variables
        $env:RAILWAY_TOKEN = $RAILWAY_PROJECT_TOKEN
        
        Write-Info "Installing dependencies..."
        npm install
        
        Write-Info "Logging into Railway..."
        railway login --token $RAILWAY_PROJECT_TOKEN
        
        Write-Info "Deploying to Railway..."
        
        # Create railway.json if it doesn't exist
        if (!(Test-Path "railway.json")) {
            $railwayConfig = @{
                "deploy" = @{
                    "startCommand" = "npm start"
                    "healthcheckPath" = "/health"
                    "healthcheckTimeout" = 300
                }
                "build" = @{
                    "command" = "npm install"
                }
            } | ConvertTo-Json -Depth 3
            
            $railwayConfig | Out-File -FilePath "railway.json" -Encoding utf8
            Write-Success "Created railway.json configuration"
        }
        
        # Deploy to Railway
        $deployResult = railway up --service $RAILWAY_PROJECT_ID 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Backend deployed successfully to Railway!"
            Write-Info "Backend URL: https://sms-service.up.railway.app"
        }
        else {
            Write-Error "Backend deployment failed"
            Write-Host $deployResult
            return $false
        }
    }
    catch {
        Write-Error "Backend deployment error: $($_.Exception.Message)"
        return $false
    }
    finally {
        Pop-Location
    }
    
    return $true
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
