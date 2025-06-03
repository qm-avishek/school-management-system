# 🚀 Quick Deployment Guide for SSGB College Management System

## ✨ One-Command Setup

```bash
# Use the Node.js deployment script (Works on all platforms)
node deploy-setup.js
```

## 🎯 Manual Quick Setup

### 1. Free Hosting Stack
- **Frontend**: [Vercel](https://vercel.com) (Free unlimited)
- **Backend**: [Railway](https://railway.app) (Free $5/month credit)
- **Database**: Railway MongoDB (Included)

### 2. Deploy Backend (Railway)
1. Create account at [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository → Choose `backend` folder
4. Add MongoDB service: "Add Service" → "MongoDB"
5. Set environment variables:
   ```env
   MONGODB_URI=mongodb://mongo:27017/ssgb_college
   JWT_SECRET=your_super_secure_secret_here
   NODE_ENV=production
   PORT=5000
   ```

### 3. Deploy Frontend (Vercel)
1. Create account at [vercel.com](https://vercel.com)
2. "New Project" → Import from GitHub
3. Select your repository
4. Set root directory: `frontend`
5. Add environment variable:
   ```env
   REACT_APP_API_URL=/api
   GENERATE_SOURCEMAP=false
   ```

### 4. Update API Proxy
Edit `frontend/vercel.json` and replace `your-backend-url.railway.app` with your actual Railway URL.

### 5. Commit and Deploy
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

## 🤖 Automated Deployment (CI/CD)

Once you push to GitHub, the CI/CD pipeline in `.github/workflows/ci-cd.yml` will automatically:
- ✅ Run tests
- ✅ Build applications
- ✅ Deploy to platforms (with proper secrets configured)

### Required GitHub Secrets:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
RAILWAY_TOKEN=your_railway_token
RAILWAY_SERVICE_ID=your_service_id
```

## 📊 Expected Result

- **Frontend**: `https://yourapp.vercel.app`
- **Backend API**: `https://yourapp.railway.app/api/health`
- **Admin Login**: `admin@ssgb.edu` / `admin123`

## 💰 Total Cost: $0/month
(Free tier limits: Railway $5 credit, Vercel unlimited personal projects)

## 🆘 Need Help?

1. **Comprehensive Guide**: Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Auto-generated Guide**: Run `node deploy-setup.js` for custom instructions
3. **GitHub Issues**: [Create an issue](../../issues) for support

---

⭐ **Pro Tip**: The `node deploy-setup.js` script does all the heavy lifting and creates custom deployment instructions for your specific repository!
