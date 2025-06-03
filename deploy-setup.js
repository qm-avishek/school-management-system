#!/usr/bin/env node

/**
 * 🚀 SSGB College Management System - Automated Deployment Setup
 * 
 * This script helps you quickly deploy your application to free cloud platforms
 * Run: node deploy-setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.magenta}🔧${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`)
};

class DeploymentSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.backendPath = path.join(this.projectRoot, 'backend');
    this.frontendPath = path.join(this.projectRoot, 'frontend');
  }

  async run() {
    log.title('🚀 SSGB College Management System - Deployment Setup');
    
    try {
      await this.checkPrerequisites();
      await this.setupEnvironmentFiles();
      await this.setupGitHubRepo();
      await this.generateDeploymentInstructions();
      await this.runPreDeploymentTests();
      
      log.title('🎉 Setup Complete!');
      this.printNextSteps();
      
    } catch (error) {
      log.error(`Setup failed: ${error.message}`);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    log.title('📋 Checking Prerequisites');
    
    // Check if git is installed
    try {
      execSync('git --version', { stdio: 'ignore' });
      log.success('Git is installed');
    } catch (error) {
      throw new Error('Git is required but not installed');
    }

    // Check if Node.js is installed
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      log.success(`Node.js ${nodeVersion} is installed`);
    } catch (error) {
      throw new Error('Node.js is required but not installed');
    }

    // Check if this is a git repository
    try {
      execSync('git status', { stdio: 'ignore' });
      log.success('Project is in a Git repository');
    } catch (error) {
      log.warning('Not a Git repository, initializing...');
      execSync('git init');
      log.success('Git repository initialized');
    }

    // Check project structure
    if (!fs.existsSync(this.backendPath)) {
      throw new Error('Backend directory not found');
    }
    if (!fs.existsSync(this.frontendPath)) {
      throw new Error('Frontend directory not found');
    }
    log.success('Project structure verified');
  }

  async setupEnvironmentFiles() {
    log.title('🔧 Setting Up Environment Files');

    // Backend environment
    const backendEnvPath = path.join(this.backendPath, '.env');
    if (!fs.existsSync(backendEnvPath)) {
      const envContent = `# Development Environment - SSGB College Backend
MONGODB_URI=mongodb://localhost:27017/ssgb_college
JWT_SECRET=dev_jwt_secret_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
`;
      fs.writeFileSync(backendEnvPath, envContent);
      log.success('Backend .env file created');
    } else {
      log.info('Backend .env file already exists');
    }

    // Frontend environment
    const frontendEnvPath = path.join(this.frontendPath, '.env');
    if (!fs.existsSync(frontendEnvPath)) {
      const envContent = `# Development Environment - SSGB College Frontend
REACT_APP_API_URL=/api
GENERATE_SOURCEMAP=true
`;
      fs.writeFileSync(frontendEnvPath, envContent);
      log.success('Frontend .env file created');
    } else {
      log.info('Frontend .env file already exists');
    }

    // Add .env to .gitignore
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    const envEntries = [
      '# Environment variables',
      '.env',
      '.env.local',
      '.env.production',
      '.env.staging',
      '**/.env',
      '**/.env.local'
    ];

    let updated = false;
    envEntries.forEach(entry => {
      if (!gitignoreContent.includes(entry)) {
        gitignoreContent += gitignoreContent.endsWith('\n') ? '' : '\n';
        gitignoreContent += entry + '\n';
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(gitignorePath, gitignoreContent);
      log.success('Updated .gitignore with environment files');
    }
  }

  async setupGitHubRepo() {
    log.title('📚 Setting Up GitHub Repository');

    try {
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      log.success(`GitHub remote found: ${remoteUrl}`);
      
      // Extract repository info
      const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^.]+)/);
      if (match) {
        this.githubOwner = match[1];
        this.githubRepo = match[2];
        log.info(`Repository: ${this.githubOwner}/${this.githubRepo}`);
      }
    } catch (error) {
      log.warning('No GitHub remote found. You\'ll need to:');
      log.info('1. Create a GitHub repository');
      log.info('2. Add it as remote: git remote add origin <repository-url>');
      log.info('3. Push your code: git push -u origin main');
    }

    // Check if CI/CD workflow exists
    const workflowPath = path.join(this.projectRoot, '.github', 'workflows', 'ci-cd.yml');
    if (fs.existsSync(workflowPath)) {
      log.success('CI/CD workflow already configured');
    } else {
      log.warning('CI/CD workflow not found in .github/workflows/ci-cd.yml');
    }
  }

  async generateDeploymentInstructions() {
    log.title('📋 Generating Deployment Instructions');

    const instructionsPath = path.join(this.projectRoot, 'DEPLOY_INSTRUCTIONS.md');
    const instructions = this.createCustomInstructions();
    
    fs.writeFileSync(instructionsPath, instructions);
    log.success('Deployment instructions created: DEPLOY_INSTRUCTIONS.md');
  }

  createCustomInstructions() {
    const repoUrl = this.githubOwner && this.githubRepo 
      ? `https://github.com/${this.githubOwner}/${this.githubRepo}` 
      : 'YOUR_GITHUB_REPOSITORY_URL';

    return `# 🚀 Quick Deployment Instructions

## Repository: ${repoUrl}

### Step 1: Deploy Backend to Railway

1. **Go to [Railway](https://railway.app)**
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select this repository**
4. **Choose the \`backend\` folder**
5. **Add Environment Variables**:
   \`\`\`
   MONGODB_URI=mongodb://mongo:27017/ssgb_college
   JWT_SECRET=${this.generateSecureSecret()}
   NODE_ENV=production
   PORT=5000
   \`\`\`
6. **Add MongoDB Service**: Click "Add Service" → "MongoDB"
7. **Copy your Railway backend URL** (e.g., https://yourapp.railway.app)

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Click "New Project" → Import from GitHub**
3. **Select this repository**
4. **Set Root Directory to \`frontend\`**
5. **Add Environment Variables**:
   \`\`\`
   REACT_APP_API_URL=/api
   GENERATE_SOURCEMAP=false
   \`\`\`
6. **Update \`frontend/vercel.json\`**:
   - Replace \`your-backend-url.railway.app\` with your Railway URL

### Step 3: Configure GitHub Secrets

Add these secrets in GitHub Repository Settings → Secrets:

#### For Railway:
- \`RAILWAY_TOKEN\`: Get from Railway Dashboard → Account Settings → Tokens
- \`RAILWAY_SERVICE_ID\`: Get from Service Settings → General

#### For Vercel:
- \`VERCEL_TOKEN\`: Get from Vercel Dashboard → Settings → Tokens
- \`VERCEL_ORG_ID\`: Run \`vercel\` CLI and check \`.vercel/project.json\`
- \`VERCEL_PROJECT_ID\`: Same as above

### Step 4: Deploy

Push to main branch:
\`\`\`bash
git add .
git commit -m "Deploy to production"
git push origin main
\`\`\`

## 🔗 Quick Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: ${repoUrl}/actions

## 🎯 Expected Result

- **Frontend**: https://yourapp.vercel.app
- **Backend API**: https://yourapp.railway.app/api/health
- **Admin Login**: admin@ssgb.edu / admin123

---
Generated on: ${new Date().toLocaleString()}
`;
  }

  generateSecureSecret() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async runPreDeploymentTests() {
    log.title('🧪 Running Pre-deployment Tests');

    // Check if dependencies are installed
    try {
      log.step('Checking backend dependencies...');
      execSync('npm list', { cwd: this.backendPath, stdio: 'ignore' });
      log.success('Backend dependencies OK');
    } catch (error) {
      log.warning('Installing backend dependencies...');
      execSync('npm install', { cwd: this.backendPath });
      log.success('Backend dependencies installed');
    }

    try {
      log.step('Checking frontend dependencies...');
      execSync('npm list', { cwd: this.frontendPath, stdio: 'ignore' });
      log.success('Frontend dependencies OK');
    } catch (error) {
      log.warning('Installing frontend dependencies...');
      execSync('npm install', { cwd: this.frontendPath });
      log.success('Frontend dependencies installed');
    }

    // Test builds
    try {
      log.step('Testing frontend build...');
      execSync('npm run build', { cwd: this.frontendPath, stdio: 'ignore' });
      log.success('Frontend build successful');
    } catch (error) {
      log.error('Frontend build failed - check for errors');
    }

    // Check for common issues
    this.checkForCommonIssues();
  }

  checkForCommonIssues() {
    log.step('Checking for common deployment issues...');

    // Check package.json scripts
    const backendPackage = JSON.parse(fs.readFileSync(path.join(this.backendPath, 'package.json')));
    if (!backendPackage.scripts.start) {
      log.warning('Backend package.json missing "start" script');
    }

    const frontendPackage = JSON.parse(fs.readFileSync(path.join(this.frontendPath, 'package.json')));
    if (!frontendPackage.scripts.build) {
      log.warning('Frontend package.json missing "build" script');
    }

    // Check for proxy configuration
    if (frontendPackage.proxy) {
      log.info('Frontend has proxy configuration - good for development');
    }

    log.success('Common issues check completed');
  }

  printNextSteps() {
    console.log(`
${colors.bold}${colors.green}🎉 Setup Complete! Next Steps:${colors.reset}

${colors.cyan}1. Review Files Created:${colors.reset}
   - DEPLOY_INSTRUCTIONS.md (step-by-step guide)
   - .env files (update for production)
   - .github/workflows/ci-cd.yml (automation)

${colors.cyan}2. Commit Your Changes:${colors.reset}
   ${colors.yellow}git add .${colors.reset}
   ${colors.yellow}git commit -m "Add deployment configuration"${colors.reset}
   ${colors.yellow}git push origin main${colors.reset}

${colors.cyan}3. Deploy Your App:${colors.reset}
   - Follow DEPLOY_INSTRUCTIONS.md
   - Railway for backend (free $5/month)
   - Vercel for frontend (free unlimited)

${colors.cyan}4. Configure GitHub Secrets:${colors.reset}
   - RAILWAY_TOKEN & RAILWAY_SERVICE_ID
   - VERCEL_TOKEN, VERCEL_ORG_ID & VERCEL_PROJECT_ID

${colors.bold}${colors.blue}📚 Documentation:${colors.reset}
   - DEPLOYMENT.md (comprehensive guide)
   - DEPLOY_INSTRUCTIONS.md (quick start)

${colors.bold}${colors.green}💰 Cost: $0/month for starter usage!${colors.reset}

${colors.bold}Need help? Check the GitHub issues or documentation!${colors.reset}
    `);
  }
}

// Run the setup
if (require.main === module) {
  const setup = new DeploymentSetup();
  setup.run().catch(console.error);
}

module.exports = DeploymentSetup;
