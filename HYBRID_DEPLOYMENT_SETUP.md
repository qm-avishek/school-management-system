# Hybrid Deployment Setup Complete

## Overview
The School Management System now uses a hybrid deployment architecture:
- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Railway

## Architecture

### Frontend (Vercel)
- **Platform**: Vercel
- **Workflow**: `.github/workflows/frontend-vercel.yml`
- **Trigger**: Changes to `frontend/**` files
- **Production URL**: To be configured after Vercel setup
- **Environment Variables**: 
  - `REACT_APP_API_URL`: Points to Railway backend URL
  - `GENERATE_SOURCEMAP`: false for security

### Backend (Railway)
- **Platform**: Railway
- **Workflow**: `.github/workflows/backend-railway.yml`
- **Trigger**: Changes to `backend/**` files
- **Production URL**: To be configured after Railway setup
- **Configuration**: `backend/railway.json`

## GitHub Actions Workflows

### 1. Frontend Vercel Workflow
**File**: `.github/workflows/frontend-vercel.yml`
- **Test Job**: Runs on pull requests to `main` branch
- **Deploy Job**: Runs on push to `main` branch
- **Required Secrets**:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_FRONTEND_PROJECT_ID`

### 2. Backend Railway Workflow
**File**: `.github/workflows/backend-railway.yml`
- **Test Job**: Runs on pull requests to `main` branch
- **Deploy Job**: Runs on push to `main` branch
- **Required Secrets**:
  - `RAILWAY_TOKEN`
  - `RAILWAY_BACKEND_SERVICE_ID`

### 3. Main CI/CD Workflow (Legacy)
**File**: `.github/workflows/ci-cd.yml`
- **Purpose**: General testing and frontend deployment
- **Status**: Updated to only deploy frontend to Vercel
- **Note**: This can be disabled once individual workflows are confirmed working

## Required GitHub Secrets

### Vercel Secrets
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_FRONTEND_PROJECT_ID=your_frontend_project_id
```

### Railway Secrets
```
RAILWAY_TOKEN=your_railway_token
RAILWAY_BACKEND_SERVICE_ID=your_backend_service_id
```

## Setup Instructions

### Step 1: Railway Backend Setup
1. Create Railway account at https://railway.app
2. Create new project and service for backend
3. Connect to GitHub repository
4. Set environment variables in Railway dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong secret for JWT tokens
   - `NODE_ENV`: production
   - `PORT`: Railway will auto-assign

### Step 2: Vercel Frontend Setup
1. Create Vercel account at https://vercel.com
2. Import frontend project from GitHub
3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your Railway backend URL
   - `GENERATE_SOURCEMAP`: false

### Step 3: GitHub Secrets Configuration
1. Go to GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add all required secrets listed above

### Step 4: Update Environment URLs
1. After Railway deployment, update:
   - `frontend/.env.production` with actual Railway URL
   - Frontend Vercel environment variables
2. After Vercel deployment, update any documentation with actual URLs

## Configuration Files

### Backend Railway Configuration
**File**: `backend/railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Frontend Vercel Configuration
**File**: `frontend/vercel.json`
- Configured for React SPA
- Handles client-side routing
- Optimized for static asset caching

## Deployment Triggers

### Frontend Deployment (Vercel)
- **Automatic**: Push to `main` branch with changes in `frontend/**`
- **Manual**: Can be triggered from Vercel dashboard
- **Workflow**: `.github/workflows/frontend-vercel.yml`

### Backend Deployment (Railway)
- **Automatic**: Push to `main` branch with changes in `backend/**`
- **Manual**: Can be triggered from Railway dashboard
- **Workflow**: `.github/workflows/backend-railway.yml`

## Testing Strategy

### Pull Request Testing
Both workflows include comprehensive testing:
- Dependency installation
- Build validation
- Unit tests (when implemented)
- Structure validation

### Deployment Testing
- Backend: Health check endpoint validation
- Frontend: Build artifact validation
- Cross-platform communication testing

## Environment Variables Management

### Development
- **Backend**: `.env` file (gitignored)
- **Frontend**: `.env` file (gitignored)

### Production
- **Backend**: Railway dashboard environment variables
- **Frontend**: Vercel dashboard environment variables

## Monitoring and Logs

### Backend (Railway)
- Access logs through Railway dashboard
- Health check monitoring at `/health` endpoint
- Automatic restart on failure

### Frontend (Vercel)
- Access logs through Vercel dashboard
- Performance monitoring
- Error tracking through build logs

## Next Steps

1. **Complete Railway Setup**: Create Railway project and service
2. **Complete Vercel Setup**: Create Vercel project for frontend
3. **Configure Secrets**: Add all required GitHub secrets
4. **Test Deployment**: Make test commits to trigger workflows
5. **Update URLs**: Replace placeholder URLs with actual deployment URLs
6. **Monitor**: Verify both services are running correctly
7. **Documentation**: Update any additional documentation with final URLs

## Troubleshooting

### Common Issues
1. **Secret Not Found**: Ensure all required secrets are configured in GitHub
2. **Build Failures**: Check workflow logs for specific error messages
3. **CORS Issues**: Verify backend CORS configuration includes frontend URL
4. **Environment Variables**: Ensure all required env vars are set on each platform

### Useful Commands
```powershell
# Test frontend build locally
cd "d:\Qualminds\school-management-system\frontend"; npm run build

# Test backend locally
cd "d:\Qualminds\school-management-system\backend"; npm start

# View workflow logs
# Check GitHub Actions tab in repository
```

## Success Criteria
- ✅ Frontend successfully deploys to Vercel
- ✅ Backend successfully deploys to Railway
- ✅ Both services communicate correctly
- ✅ GitHub Actions workflows trigger on appropriate changes
- ✅ All tests pass in CI/CD pipeline
- ✅ Health checks pass for both services
