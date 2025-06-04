# Railway GitHub Actions Setup Guide

<!-- Last updated: 2025-06-04 - Verified Railway deployment working -->

## 🔑 Step 1: Get Railway Secrets

### A. Get RAILWAY_TOKEN:
1. **Login to Railway**: Go to [https://railway.app](https://railway.app)
2. **Navigate to Account**: Click your profile → "Account" → "Tokens"
   - Direct URL: [https://railway.app/account/tokens](https://railway.app/account/tokens)
3. **Create Token**: 
   - Click "Create New Token"
   - Name: `GitHub-Actions-Deploy`
   - Click "Create"
4. **Copy Token**: Copy the generated token (starts with `rlwy_...`)

### B. Get RAILWAY_SERVICE_ID:

⚠️ **IMPORTANT**: You need the **SERVICE ID**, not the Project ID!

**Railway Structure:**
- 📁 **PROJECT** (contains multiple services) → Has Project ID
  - 🔧 **Backend Service** → Has Service ID ✅ (This is what you need)
  - 🌐 **Frontend Service** → Has Service ID  
  - 🗄️ **Database Service** → Has Service ID

**To get the correct SERVICE ID:**
1. **Go to Project**: Navigate to your Railway project dashboard
2. **Select Backend Service**: Click specifically on your backend service (not the project)
3. **Open Settings**: Click "Settings" tab
4. **Find Service ID**: Look for "Service ID" field and copy the value
   - Alternative: Check the URL - it's the ID after `/service/`
   - Example: `https://railway.app/project/abc123/service/def456` → Service ID is `def456`

**URL Structure:**
- Project URL: `railway.app/project/PROJECT_ID` ❌ (Don't use this ID)
- Service URL: `railway.app/project/PROJECT_ID/service/SERVICE_ID` ✅ (Use the SERVICE_ID)

## 🔧 Step 2: Set GitHub Repository Secrets

### Navigate to GitHub Settings:
1. **Go to Repository**: [https://github.com/qm-avishek/school-management-system](https://github.com/qm-avishek/school-management-system)
2. **Click Settings**: Top tab in repository (not your profile settings)
3. **Secrets Menu**: Left sidebar → "Secrets and variables" → "Actions"

### Add Secrets:
1. **Click "New repository secret"**
2. **Add Secret 1**:
   - Name: `RAILWAY_TOKEN`
   - Value: Your Railway token (starts with `rlwy_...`)
   - Click "Add secret"
3. **Add Secret 2**:
   - Name: `RAILWAY_SERVICE_ID`
   - Value: Your Railway service ID
   - Click "Add secret"

## ✅ Step 3: Verify Setup

After adding both secrets, you should see:
- `RAILWAY_TOKEN` ✅
- `RAILWAY_SERVICE_ID` ✅

## 🚀 Step 4: Test Deployment

1. **Make a small change** to any file (like adding a comment)
2. **Commit and push** to main branch:
   ```bash
   git add .
   git commit -m "Test automatic Railway deployment"
   git push origin main
   ```
3. **Check GitHub Actions**: Go to "Actions" tab in your repository
4. **Monitor Deployment**: Watch the workflow run and deploy to Railway

## 🔍 Troubleshooting

### If deployment fails:
1. **Check Secrets**: Ensure both secrets are correctly set
2. **Check Railway**: Verify service is active and accessible
3. **Check Logs**: Look at GitHub Actions logs for error details
4. **Token Permissions**: Ensure Railway token has deploy permissions

### Common Issues:
- **Invalid Token**: Regenerate Railway token
- **Wrong Service ID**: Double-check the service ID from Railway dashboard
- **Network Issues**: Railway or GitHub temporary issues

## 📋 Current Workflow

Your GitHub Actions will automatically:
1. ✅ Run tests when code is pushed
2. ✅ Build frontend and backend
3. ✅ Deploy frontend to Vercel (if secrets configured)
4. ✅ Deploy backend to Railway (once secrets are added)
5. ✅ Report deployment status

## 🎯 Next Steps

Once secrets are configured:
1. Every push to `main` branch will automatically deploy
2. Monitor deployments in GitHub Actions tab
3. Check Railway dashboard for live application status
4. Test your deployed application endpoints

---
**Note**: Keep your Railway token secure and never commit it to your code!
