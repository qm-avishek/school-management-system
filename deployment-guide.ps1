# Manual Deployment Guide - School Management System
# Use this guide to deploy manually using the provided tokens

Write-Host "=== Manual Deployment Guide ===" -ForegroundColor Green
Write-Host "Your tokens have been validated. Follow these steps for manual deployment:" -ForegroundColor Yellow

Write-Host "`n=== Step 1: Railway Backend Deployment ===" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app/dashboard" -ForegroundColor White
Write-Host "2. Login to your account" -ForegroundColor White
Write-Host "3. Create a new project or use existing project ID: 64c7d8db-5b5c-4f0b-82e8-32d7e911a874" -ForegroundColor White
Write-Host "4. Create a new service with ID: 8a40dbd6-f389-4f50-b53e-9689a4977c91" -ForegroundColor White
Write-Host "5. Connect your GitHub repository: school-management-system" -ForegroundColor White
Write-Host "6. Set Root Directory: backend" -ForegroundColor White
Write-Host "7. Add these environment variables:" -ForegroundColor White
Write-Host "   - MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ssgb_college" -ForegroundColor Gray
Write-Host "   - JWT_SECRET=your_secure_secret_here" -ForegroundColor Gray
Write-Host "   - NODE_ENV=production" -ForegroundColor Gray
Write-Host "   - PORT=5000" -ForegroundColor Gray

Write-Host "`n=== Step 2: Vercel Frontend Deployment ===" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Login to your account" -ForegroundColor White
Write-Host "3. Import your GitHub repository" -ForegroundColor White
Write-Host "4. Set Root Directory: frontend" -ForegroundColor White
Write-Host "5. Add these environment variables:" -ForegroundColor White
Write-Host "   - REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api" -ForegroundColor Gray
Write-Host "   - GENERATE_SOURCEMAP=false" -ForegroundColor Gray

Write-Host "`n=== Step 3: Alternative CLI Deployment (if above fails) ===" -ForegroundColor Cyan
Write-Host "Use these commands after setting up the projects in the dashboards:" -ForegroundColor White

Write-Host "`nBackend (Railway):" -ForegroundColor Yellow
Write-Host "cd `"d:\Qualminds\school-management-system\backend`"" -ForegroundColor Gray
Write-Host "`$env:RAILWAY_TOKEN = `"2c291c17-9581-44f9-89a0-0da65976bead`"" -ForegroundColor Gray
Write-Host "npm install" -ForegroundColor Gray
Write-Host "railway login" -ForegroundColor Gray
Write-Host "railway up" -ForegroundColor Gray

Write-Host "`nFrontend (Vercel):" -ForegroundColor Yellow
Write-Host "cd `"d:\Qualminds\school-management-system\frontend`"" -ForegroundColor Gray
Write-Host "`$env:VERCEL_TOKEN = `"Wcy6d56q7FEBKup6677RqcwP`"" -ForegroundColor Gray
Write-Host "npm install" -ForegroundColor Gray
Write-Host "npm run build" -ForegroundColor Gray
Write-Host "vercel --prod" -ForegroundColor Gray

Write-Host "`n=== Step 4: GitHub Actions Deployment ===" -ForegroundColor Cyan
Write-Host "Your repository now has GitHub Actions workflows with hardcoded tokens:" -ForegroundColor White
Write-Host "1. Push your code to the main branch" -ForegroundColor White
Write-Host "2. GitHub Actions will automatically deploy both services" -ForegroundColor White
Write-Host "3. Check the Actions tab in your GitHub repository for deployment status" -ForegroundColor White

Write-Host "`n=== Updated Files with Hardcoded Tokens ===" -ForegroundColor Cyan
Write-Host "✅ .github/workflows/backend-railway.yml - Railway deployment" -ForegroundColor Green
Write-Host "✅ .github/workflows/frontend-vercel-hardcoded.yml - Vercel deployment" -ForegroundColor Green
Write-Host "✅ .github/workflows/combined-deploy.yml - Combined deployment" -ForegroundColor Green
Write-Host "✅ deploy-tokens.ps1 - PowerShell deployment script" -ForegroundColor Green
Write-Host "✅ deploy-with-tokens.js - Node.js deployment script" -ForegroundColor Green

Write-Host "`n=== Your Tokens (for reference) ===" -ForegroundColor Cyan
Write-Host "Vercel Token: Wcy6d56q7FEBKup6677RqcwP" -ForegroundColor Gray
Write-Host "Vercel Org ID: avishek-kumars-projects" -ForegroundColor Gray
Write-Host "Vercel Project ID: prj_RLZw3QVlINTR6P6nrlUTdEh7y6fL" -ForegroundColor Gray
Write-Host "Railway Token: 2c291c17-9581-44f9-89a0-0da65976bead" -ForegroundColor Gray
Write-Host "Railway Project ID: 64c7d8db-5b5c-4f0b-82e8-32d7e911a874" -ForegroundColor Gray
Write-Host "Railway Service ID: 8a40dbd6-f389-4f50-b53e-9689a4977c91" -ForegroundColor Gray

Write-Host "`n=== Testing Credentials ===" -ForegroundColor Cyan
Write-Host "Once deployed, test with these credentials:" -ForegroundColor White
Write-Host "Email: admin@ssgb.edu" -ForegroundColor Gray
Write-Host "Password: admin123" -ForegroundColor Gray

Write-Host "`n=== Next Steps ===" -ForegroundColor Green
Write-Host "1. Try the GitHub Actions deployment first (push to main branch)" -ForegroundColor White
Write-Host "2. If that fails, use the web dashboard method" -ForegroundColor White
Write-Host "3. If you need help, check the deployment logs in respective dashboards" -ForegroundColor White
Write-Host "4. For MongoDB, set up MongoDB Atlas with the connection string" -ForegroundColor White

Write-Host "`n✅ All deployment files have been updated with your hardcoded tokens!" -ForegroundColor Green
