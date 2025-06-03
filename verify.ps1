# System Verification Script for SSGB Engineering College Management System

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🔍 SSGB College Management System Verification" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test HTTP endpoint
function Test-Endpoint {
    param($url, $name)
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $name is responding (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  $name returned status: $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "❌ $name is not accessible: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to check if port is in use
function Test-Port {
    param($port, $name)
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "✅ Port $port ($name) is active" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Port $port ($name) is not active" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Could not check port $port ($name)" -ForegroundColor Red
        return $false
    }
}

# Check project structure
Write-Host "📁 Checking project structure..." -ForegroundColor Yellow

$requiredPaths = @(
    "backend\package.json",
    "backend\server.js",
    "backend\.env",
    "frontend\package.json",
    "frontend\src\App.js",
    "README.md",
    "DATABASE_SETUP.md"
)

$structureOk = $true
foreach ($path in $requiredPaths) {
    if (Test-Path $path) {
        Write-Host "  ✅ $path" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $path (missing)" -ForegroundColor Red
        $structureOk = $false
    }
}

Write-Host ""

# Check Node.js and npm
Write-Host "🔧 Checking system requirements..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js not found" -ForegroundColor Red
}

try {
    $npmVersion = npm --version
    Write-Host "  ✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm not found" -ForegroundColor Red
}

Write-Host ""

# Check if dependencies are installed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

if (Test-Path "backend\node_modules") {
    Write-Host "  ✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend dependencies not installed (run: cd backend && npm install)" -ForegroundColor Red
}

if (Test-Path "frontend\node_modules") {
    Write-Host "  ✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend dependencies not installed (run: cd frontend && npm install)" -ForegroundColor Red
}

Write-Host ""

# Check if servers are running
Write-Host "🌐 Checking servers..." -ForegroundColor Yellow

$backendPort = Test-Port -port 5000 -name "Backend API"
$frontendPort = Test-Port -port 3000 -name "Frontend"

Write-Host ""

# Test API endpoints if backend is running
if ($backendPort) {
    Write-Host "🔍 Testing API endpoints..." -ForegroundColor Yellow
    
    $healthCheck = Test-Endpoint -url "http://localhost:5000/api/health" -name "Health Check API"
    
    if ($healthCheck) {
        try {
            $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -UseBasicParsing
            Write-Host "  📊 Database Status: $($healthResponse.database.status)" -ForegroundColor $(if ($healthResponse.database.connected) { "Green" } else { "Yellow" })
            Write-Host "  🔧 Environment: $($healthResponse.environment)" -ForegroundColor Cyan
        } catch {
            Write-Host "  ⚠️  Could not parse health check response" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# Test frontend if running
if ($frontendPort) {
    Write-Host "🎨 Testing frontend..." -ForegroundColor Yellow
    Test-Endpoint -url "http://localhost:3000" -name "Frontend Dashboard" | Out-Null
}

Write-Host ""

# Summary
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📋 VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

if ($structureOk) {
    Write-Host "✅ Project structure: Complete" -ForegroundColor Green
} else {
    Write-Host "❌ Project structure: Issues found" -ForegroundColor Red
}

if ($backendPort) {
    Write-Host "✅ Backend server: Running on port 5000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend server: Not running" -ForegroundColor Red
    Write-Host "   Start with: cd backend && npm run dev" -ForegroundColor Gray
}

if ($frontendPort) {
    Write-Host "✅ Frontend server: Running on port 3000" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend server: Not running" -ForegroundColor Red
    Write-Host "   Start with: cd frontend && npm start" -ForegroundColor Gray
}

Write-Host ""

# Access instructions
Write-Host "🌐 ACCESS URLS:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "   Health Check: http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""

# Next steps
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
if (-not $backendPort -or -not $frontendPort) {
    Write-Host "   1. Start missing servers using start.ps1 script" -ForegroundColor White
}
Write-Host "   2. Configure database (see DATABASE_SETUP.md)" -ForegroundColor White
Write-Host "   3. Seed admin user: cd backend; npm run seed" -ForegroundColor White
Write-Host "   4. Access dashboard and login with admin@ssgb.edu / admin123" -ForegroundColor White

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
