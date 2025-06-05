# Manual Deployment Verification Script
# Tests if the deployments are working

Write-Host "🔍 Checking Current Deployment Status" -ForegroundColor Cyan
Write-Host "=" * 50

# Test Backend Health
Write-Host "🔧 Testing Backend..." -ForegroundColor Yellow
try {
    $backendHealth = Invoke-RestMethod -Uri "https://sms-service.up.railway.app/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend Status: $($backendHealth.status)" -ForegroundColor Green
    Write-Host "📡 Backend URL: https://sms-service.up.railway.app" -ForegroundColor Green
}
catch {
    Write-Host "❌ Backend Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔄 Checking if backend is accessible..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://sms-service.up.railway.app" -Method GET -TimeoutSec 10
        Write-Host "✅ Backend is responding (Status: $($response.StatusCode))" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Backend is not accessible" -ForegroundColor Red
    }
}

Write-Host ""

# Test Frontend
Write-Host "🌐 Testing Frontend..." -ForegroundColor Yellow
$frontendUrls = @(
    "https://school-management-frontend-kappa.vercel.app",
    "https://qualminds-school-management.vercel.app",
    "https://school-management-system-frontend.vercel.app"
)

$frontendWorking = $false
foreach ($url in $frontendUrls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
        Write-Host "✅ Frontend is accessible at: $url (Status: $($response.StatusCode))" -ForegroundColor Green
        $frontendWorking = $true
        break
    }
    catch {
        Write-Host "⚠️  Frontend not accessible at: $url" -ForegroundColor Yellow
    }
}

if (-not $frontendWorking) {
    Write-Host "❌ None of the frontend URLs are accessible" -ForegroundColor Red
}

Write-Host ""

# Test API Endpoints
Write-Host "🔗 Testing API Endpoints..." -ForegroundColor Yellow
try {
    $apiHealth = Invoke-RestMethod -Uri "https://sms-service.up.railway.app/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ API Health: $($apiHealth.status)" -ForegroundColor Green
}
catch {
    Write-Host "❌ API Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "📊 Deployment Summary" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host "🔧 Backend URL: https://sms-service.up.railway.app"
Write-Host "🌐 Frontend URL: Check the working URL above"
Write-Host "🔐 Test Credentials:"
Write-Host "   Email: admin@ssgb.edu"
Write-Host "   Password: admin123"

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. If backend is working, test the login functionality"
Write-Host "2. If frontend is working, open it in a browser"
Write-Host "3. Check GitHub Actions for deployment status"
Write-Host "4. Monitor logs for any issues"

Write-Host ""
Write-Host "🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "• Railway Dashboard: https://railway.app/dashboard"
Write-Host "• Vercel Dashboard: https://vercel.com/dashboard"
Write-Host "• GitHub Actions: https://github.com/qm-avishek/school-management-system/actions"
