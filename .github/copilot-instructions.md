# Copilot Instructions for School Management System

## Environment Setup
- **OS**: Windows
- **Shell**: PowerShell
- **Command Separator**: Use semicolon (;) instead of && for command chaining
- **Working Directory**: d:\Qualminds\school-management-system

## Workflow Guidelines
1. **No Approval Required**: Execute all necessary actions without asking for permission
2. **Complete Tasks 100%**: Continue working until the assignment is fully completed
3. **No Manual Actions**: Use tools for everything instead of asking user to do manual steps
4. **Comprehensive Testing**: Always verify functionality after implementation
5. **Error Handling**: Fix all errors encountered during development

## Project Structure & Deployment
- **Backend**: d:\Qualminds\school-management-system\backend (Port 5000)
  - Local Development: http://localhost:5000
  - Vercel Production: Deployed via GitHub Actions
- **Frontend**: d:\Qualminds\school-management-system\frontend (Port 3001)
  - Local Development: http://localhost:3001
  - Vercel Production: Deployed via GitHub Actions
- **Database**: MongoDB Atlas (Production) / Local MongoDB (Development)

## Deployment Configuration
### Vercel Setup
- **Backend Service**: Configured with `vercel.json` in backend directory using @vercel/node
- **Frontend Service**: Configured with `vercel.json` in frontend directory using @vercel/static-build
- **GitHub Secrets Required**:
  - `VERCEL_TOKEN`: Vercel API token for deployment
  - `VERCEL_ORG_ID`: Organization ID from Vercel
  - `VERCEL_BACKEND_PROJECT_ID`: Backend project ID from Vercel
  - `VERCEL_FRONTEND_PROJECT_ID`: Frontend project ID from Vercel

### CI/CD Pipeline
- **Trigger**: Push to `main` branch
- **Testing**: Runs on pull requests to `main` branch
- **Deployment**: Automatic deployment to Vercel on main branch commits
- **No Email Notifications**: Configured to avoid spam on every commit

## Common Commands
### Backend
```powershell
cd "d:\Qualminds\school-management-system\backend"; npm start
cd "d:\Qualminds\school-management-system\backend"; npm install
cd "d:\Qualminds\school-management-system\backend"; node scripts/seedAdmin.js
```

### Frontend
```powershell
cd "d:\Qualminds\school-management-system\frontend"; npm start
cd "d:\Qualminds\school-management-system\frontend"; npm install
cd "d:\Qualminds\school-management-system\frontend"; npm run build
```

### Vercel Deployment (Manual)
```powershell
# Install Vercel CLI globally
npm install -g vercel

# Backend deployment
cd "d:\Qualminds\school-management-system\backend"; vercel --prod

# Frontend deployment
cd "d:\Qualminds\school-management-system\frontend"; vercel --prod
```

## Current System Status
- **Database**: MongoDB Atlas for production, Local MongoDB for development
- **Admin User**: admin@ssgb.edu / admin123
- **Backend**: Express server with CORS and authentication, deployed on Vercel
- **Frontend**: React app with proxy configuration for local dev, static build served on Vercel
- **CI/CD**: GitHub Actions workflow for automated testing and deployment

## Development Rules
1. Always use relative API URLs (/api) in frontend for local development
2. Use environment variables for API URLs in production
3. Use semicolon (;) for PowerShell command chaining
4. Test all functionality locally before pushing to main
5. Remove debug console.log statements after testing
6. Implement comprehensive error handling
7. Ensure responsive UI design
8. Complete all CRUD operations testing
9. Never commit sensitive data (passwords, API keys) to repository

## Authentication Flow
1. User submits login form
2. Frontend calls /api/auth/login (local) or production API endpoint
3. Backend validates credentials against MongoDB
4. Returns JWT token and user data
5. Frontend stores auth state in context
6. Navigate to dashboard on success
7. Protected routes check authentication status

## Production Environment Variables
### Backend (Vercel)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Production JWT secret
- `NODE_ENV`: production
- `CORS_ORIGIN`: Frontend URL on Vercel

### Frontend (Vercel)
- `REACT_APP_API_URL`: Backend URL on Vercel
- `GENERATE_SOURCEMAP`: false (for security)

## GitHub Actions Workflow
- **Trigger**: Push to main branch only
- **Jobs**:
  1. **Test Job**: Runs on pull requests
     - Install dependencies
     - Run backend and frontend tests
     - Build frontend for validation
  2. **Deploy Job**: Runs on main branch pushes
     - Deploy backend to Vercel
     - Deploy frontend to Vercel
- **Parallel Deployment**: Deploys both services simultaneously for faster deployment

## Vercel Configuration
### Backend Configuration (vercel.json)
- **Build**: Uses @vercel/node for Node.js API
- **Routes**: Configured for API endpoints (/api/*) and health checks
- **Functions**: 30-second timeout for serverless functions
- **Environment**: Production environment variables

### Frontend Configuration (vercel.json)
- **Build**: Uses @vercel/static-build for React SPA
- **Routes**: SPA routing with fallback to index.html
- **Caching**: Static assets cached for 1 year
- **Build Directory**: React build output directory

## Next Steps Priority
1. Create Vercel projects for backend and frontend
2. Obtain Vercel organization ID and project IDs
3. Set up GitHub repository secrets for Vercel deployment
4. Test complete CI/CD pipeline with a test commit to main
5. Verify production deployments are working correctly
6. Test complete login flow on production environment
7. Monitor Vercel deployment logs for any issues
8. Set up monitoring and health checks for production services

## Vercel Setup Instructions
### Step 1: Create Vercel Account and Projects
1. Sign up at https://vercel.com with GitHub account
2. Import backend project from GitHub repository
3. Import frontend project from GitHub repository
4. Configure environment variables in Vercel dashboard

### Step 2: GitHub Secrets Configuration
Set the following secrets in GitHub repository settings:
- `VERCEL_TOKEN`: Personal access token from Vercel
- `VERCEL_ORG_ID`: Organization ID from Vercel account settings
- `VERCEL_BACKEND_PROJECT_ID`: Project ID from backend project settings
- `VERCEL_FRONTEND_PROJECT_ID`: Project ID from frontend project settings

### Step 3: Environment Variables
#### Backend (Vercel Dashboard):
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Strong JWT secret for production
- `NODE_ENV`: production
- `CORS_ORIGIN`: Frontend domain on Vercel

#### Frontend (Vercel Dashboard):
- `REACT_APP_API_URL`: Backend domain on Vercel
- `GENERATE_SOURCEMAP`: false
