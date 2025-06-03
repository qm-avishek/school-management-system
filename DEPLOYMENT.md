# 🚀 Deployment Guide - SSGB College Management System

This guide walks you through deploying the School Management System to free cloud platforms using GitHub Actions CI/CD.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Accounts Required**:
   - [Vercel Account](https://vercel.com) (for frontend)
   - [Railway Account](https://railway.app) (for backend + database)
   - [MongoDB Atlas Account](https://www.mongodb.com/atlas) (alternative database)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions │───▶│  Deploy Target  │
│                 │    │    (CI/CD)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                    ┌─────────▼────────┐     ┌─────────▼────────┐     ┌─────────▼────────┐
                    │     Vercel       │     │     Railway      │     │  MongoDB Atlas   │
                    │   (Frontend)     │     │   (Backend)      │     │   (Database)     │
                    │  React Static    │     │   Node.js API    │     │   Cloud DB       │
                    └──────────────────┘     └──────────────────┘     └──────────────────┘
```

## 🎯 Deployment Options

### Option 1: Railway + Vercel (Recommended)
- **Frontend**: Vercel (Free tier: Unlimited projects)
- **Backend**: Railway (Free tier: $5 credit monthly)
- **Database**: Railway PostgreSQL/MongoDB (Included)

### Option 2: Render (Alternative)
- **Full-stack**: Render (Free tier with limitations)
- **Database**: MongoDB Atlas (Free tier: 512MB)

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. **Ensure your repository has the CI/CD workflow**:
   - The file `.github/workflows/ci-cd.yml` should exist
   - Contains build, test, and deploy jobs

### Step 2: Setup Railway (Backend + Database)

1. **Create Railway Account**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**:
   ```bash
   # Option A: From GitHub repo
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the backend folder
   ```

3. **Configure Environment Variables in Railway**:
   ```env
   MONGODB_URI=mongodb://mongo:27017/ssgb_college
   JWT_SECRET=your_production_jwt_secret_here
   NODE_ENV=production
   PORT=5000
   ```

4. **Add MongoDB Service**:
   - In Railway dashboard, click "Add Service"
   - Select "MongoDB"
   - Railway will auto-generate connection string

### Step 3: Setup Vercel (Frontend)

1. **Create Vercel Account**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**:
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Deploy

3. **Configure Environment Variables in Vercel**:
   ```env
   REACT_APP_API_URL=/api
   GENERATE_SOURCEMAP=false
   ```

4. **Update API Proxy**:
   - Update `frontend/vercel.json`
   - Replace `your-backend-url.railway.app` with your Railway URL

### Step 4: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. **Go to GitHub Repository Settings**:
   - Settings → Secrets and variables → Actions

2. **Add Secrets**:

   **For Vercel**:
   ```
   VERCEL_TOKEN=your_vercel_token
   VERCEL_ORG_ID=your_org_id
   VERCEL_PROJECT_ID=your_project_id
   ```

   **For Railway**:
   ```
   RAILWAY_TOKEN=your_railway_token
   RAILWAY_SERVICE_ID=your_service_id
   ```

### Step 5: Trigger Deployment

1. **Push to main branch**:
```bash
git push origin main
```

2. **Monitor GitHub Actions**:
   - Go to GitHub → Actions tab
   - Watch the CI/CD pipeline run

## 🔧 Getting Deployment Tokens

### Vercel Tokens

1. **Vercel Token**:
   - Go to Vercel Dashboard
   - Settings → Tokens
   - Create new token

2. **Project IDs**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and get project info
   vercel login
   cd frontend
   vercel link
   cat .vercel/project.json
   ```

### Railway Tokens

1. **Railway Token**:
   - Go to Railway Dashboard
   - Account Settings → Tokens
   - Create new token

2. **Service ID**:
   - In your project dashboard
   - Service settings → General
   - Copy Service ID

## 🌐 Alternative: One-Click Deploy

### Deploy to Railway (Backend)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/your-template)

### Deploy to Vercel (Frontend)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/yourusername/yourrepository)

## 📊 Monitoring & Logs

### Railway
- **Logs**: Railway Dashboard → Service → Logs
- **Metrics**: Railway Dashboard → Service → Metrics
- **Health Check**: `https://your-app.railway.app/api/health`

### Vercel
- **Logs**: Vercel Dashboard → Project → Functions
- **Analytics**: Vercel Dashboard → Project → Analytics
- **Performance**: Built-in Web Vitals monitoring

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**:
   ```bash
   # Check dependencies
   npm audit
   npm ci
   
   # Check environment variables
   echo $NODE_ENV
   ```

2. **Database Connection Error**:
   - Verify MongoDB URI format
   - Check network access in MongoDB Atlas
   - Ensure environment variables are set

3. **API Proxy Issues**:
   - Update `vercel.json` with correct backend URL
   - Check CORS configuration in backend

4. **GitHub Actions Failing**:
   - Check secrets are correctly set
   - Verify token permissions
   - Review action logs

### Health Checks

```bash
# Backend health
curl https://your-backend.railway.app/api/health

# Frontend
curl https://your-frontend.vercel.app
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database connection secured
- [ ] JWT secrets are strong and unique
- [ ] CORS properly configured
- [ ] Health checks working
- [ ] SSL certificates active (auto in Vercel/Railway)
- [ ] Error monitoring setup
- [ ] Backup strategy planned

## 💰 Cost Breakdown

### Free Tier Limits

**Vercel**:
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth/month
- ✅ 6,000 build minutes/month

**Railway**:
- ✅ $5 monthly credit
- ✅ Shared CPU/RAM
- ✅ 1GB storage
- ⚠️ ~550 hours/month runtime

**MongoDB Atlas**:
- ✅ 512MB storage
- ✅ Shared cluster
- ⚠️ Connection limits

## 🔄 Updates & Maintenance

### Automated Updates
- GitHub Actions runs on every push to `main`
- Dependencies updated via Dependabot
- Security scanning included

### Manual Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit fix

# Deploy specific branch
git push origin feature-branch
```

## 🎓 Next Steps

1. **Custom Domain**: Configure custom domain in Vercel
2. **Monitoring**: Setup error tracking (Sentry)
3. **Analytics**: Add Google Analytics
4. **CDN**: Configure for static assets
5. **Backup**: Setup automated database backups

## 📞 Support

- **GitHub Issues**: [Repository Issues](https://github.com/yourusername/yourrepository/issues)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

**🎉 Congratulations!** Your School Management System is now live and automatically deployable!
