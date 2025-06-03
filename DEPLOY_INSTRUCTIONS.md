# 🚀 Quick Deployment Instructions

## Repository: https://github.com/qm-avishek/school-management-system

### Step 1: Deploy Backend to Railway

1. **Go to [Railway](https://railway.app)**
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select this repository**
4. **Choose the `backend` folder**
5. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb://mongo:27017/ssgb_college
   JWT_SECRET=WbbSZ0rhJo8YhXt88ErJcG41YNYZRivFV&V5ZMo$qozTycFE4%*LSeHlkPDIQs$c
   NODE_ENV=production
   PORT=5000
   ```
6. **Add MongoDB Service**: Click "Add Service" → "MongoDB"
7. **Copy your Railway backend URL** (e.g., https://yourapp.railway.app)

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Click "New Project" → Import from GitHub**
3. **Select this repository**
4. **Set Root Directory to `frontend`**
5. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=/api
   GENERATE_SOURCEMAP=false
   ```
6. **Update `frontend/vercel.json`**:
   - Replace `your-backend-url.railway.app` with your Railway URL

### Step 3: Configure GitHub Secrets

Add these secrets in GitHub Repository Settings → Secrets:

#### For Railway:
- `RAILWAY_TOKEN`: Get from Railway Dashboard → Account Settings → Tokens
- `RAILWAY_SERVICE_ID`: Get from Service Settings → General

#### For Vercel:
- `VERCEL_TOKEN`: Get from Vercel Dashboard → Settings → Tokens
- `VERCEL_ORG_ID`: Run `vercel` CLI and check `.vercel/project.json`
- `VERCEL_PROJECT_ID`: Same as above

### Step 4: Deploy

Push to main branch:
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

## 🔗 Quick Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/qm-avishek/school-management-system/actions

## 🎯 Expected Result

- **Frontend**: https://yourapp.vercel.app
- **Backend API**: https://yourapp.railway.app/api/health
- **Admin Login**: admin@ssgb.edu / admin123

---
Generated on: 3/6/2025, 4:05:28 pm
