# Hybrid Deployment Validation Script
# This script validates the hybrid deployment configuration

Write-Host "🚀 SSGB College - Hybrid Deployment Validation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check if workflows exist
Write-Host "`n📋 Checking GitHub Actions Workflows..." -ForegroundColor Yellow

$frontendWorkflow = "d:\Qualminds\school-management-system\.github\workflows\frontend-vercel.yml"
$backendWorkflow = "d:\Qualminds\school-management-system\.github\workflows\backend-railway.yml"
$mainWorkflow = "d:\Qualminds\school-management-system\.github\workflows\ci-cd.yml"

if (Test-Path $frontendWorkflow) {
    Write-Host "  ✅ Frontend Vercel workflow exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend Vercel workflow missing" -ForegroundColor Red
}

if (Test-Path $backendWorkflow) {
    Write-Host "  ✅ Backend Railway workflow exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend Railway workflow missing" -ForegroundColor Red
}

if (Test-Path $mainWorkflow) {
    Write-Host "  ✅ Main CI/CD workflow exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Main CI/CD workflow missing" -ForegroundColor Red
}

# Check configuration files
Write-Host "`n🔧 Checking Configuration Files..." -ForegroundColor Yellow

$railwayConfig = "d:\Qualminds\school-management-system\backend\railway.json"
$vercelConfig = "d:\Qualminds\school-management-system\frontend\vercel.json"
$envProduction = "d:\Qualminds\school-management-system\frontend\.env.production"

if (Test-Path $railwayConfig) {
    Write-Host "  ✅ Railway configuration exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Railway configuration missing" -ForegroundColor Red
}

if (Test-Path $vercelConfig) {
    Write-Host "  ✅ Vercel configuration exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Vercel configuration missing" -ForegroundColor Red
}

if (Test-Path $envProduction) {
    Write-Host "  ✅ Frontend production environment file exists" -ForegroundColor Green
    
    # Check if it points to Railway
    $envContent = Get-Content $envProduction -Raw
    if ($envContent -match "railway\.app") {
        Write-Host "  ✅ Frontend configured to use Railway backend" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Frontend may not be configured for Railway backend" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ Frontend production environment file missing" -ForegroundColor Red
}

# Check if Vercel config is removed from backend
$backendVercelConfig = "d:\Qualminds\school-management-system\backend\vercel.json"
if (Test-Path $backendVercelConfig) {
    Write-Host "  ⚠️  Backend still has Vercel config (should be removed)" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ Backend Vercel config properly removed" -ForegroundColor Green
}

# Check package.json files
Write-Host "`n📦 Checking Package Files..." -ForegroundColor Yellow

$backendPackage = "d:\Qualminds\school-management-system\backend\package.json"
$frontendPackage = "d:\Qualminds\school-management-system\frontend\package.json"

if (Test-Path $backendPackage) {
    Write-Host "  ✅ Backend package.json exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend package.json missing" -ForegroundColor Red
}

if (Test-Path $frontendPackage) {
    Write-Host "  ✅ Frontend package.json exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend package.json missing" -ForegroundColor Red
}

# Summary
Write-Host "`n📊 Deployment Architecture Summary" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  🎯 Frontend: Vercel (React Static App)" -ForegroundColor Green
Write-Host "  🎯 Backend:  Railway (Node.js API)" -ForegroundColor Green
Write-Host "  🎯 Database: MongoDB Atlas (Cloud)" -ForegroundColor Green

Write-Host "`n[KEY] Required GitHub Secrets:" -ForegroundColor Yellow
Write-Host "  Vercel:" -ForegroundColor White
Write-Host "    - VERCEL_TOKEN" -ForegroundColor Gray
Write-Host "    - VERCEL_ORG_ID" -ForegroundColor Gray
Write-Host "    - VERCEL_FRONTEND_PROJECT_ID" -ForegroundColor Gray
Write-Host "  Railway:" -ForegroundColor White
Write-Host "    - RAILWAY_TOKEN" -ForegroundColor Gray
Write-Host "    - RAILWAY_BACKEND_SERVICE_ID" -ForegroundColor Gray

Write-Host "`n[NEXT] Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Create Railway project for backend" -ForegroundColor White
Write-Host "  2. Create Vercel project for frontend" -ForegroundColor White
Write-Host "  3. Configure GitHub secrets" -ForegroundColor White
Write-Host "  4. Test deployments with commits to main branch" -ForegroundColor White
Write-Host "  5. Update URLs in documentation" -ForegroundColor White

Write-Host "`n[DOCS] Documentation:" -ForegroundColor Yellow
Write-Host "  - HYBRID_DEPLOYMENT_SETUP.md (Complete guide)" -ForegroundColor White
Write-Host "  - README.md (Updated with hybrid info)" -ForegroundColor White

Write-Host "`n[SUCCESS] Hybrid deployment setup validation complete!" -ForegroundColor Green
