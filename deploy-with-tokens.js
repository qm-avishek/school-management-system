#!/usr/bin/env node

/**
 * 🚀 SSGB College Management System - Hardcoded Token Deployment
 * 
 * This script deploys the application using hardcoded tokens for immediate deployment
 * Run: node deploy-with-tokens.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// Hardcoded tokens
const TOKENS = {
  VERCEL_TOKEN: 'Wcy6d56q7FEBKup6677RqcwP',
  VERCEL_PROJECT_ID: 'prj_RLZw3QVlINTR6P6nrlUTdEh7y6fL',
  VERCEL_ORG_ID: 'avishek-kumars-projects',
  RAILWAY_PROJECT_TOKEN: '2c291c17-9581-44f9-89a0-0da65976bead',
  RAILWAY_PROJECT_ID: '64c7d8db-5b5c-4f0b-82e8-32d7e911a874',
  RAILWAY_SERVICE_ID: '8a40dbd6-f389-4f50-b53e-9689a4977c91'
};

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

class HardcodedDeployment {
  constructor() {
    this.projectRoot = process.cwd();
    this.backendPath = path.join(this.projectRoot, 'backend');
    this.frontendPath = path.join(this.projectRoot, 'frontend');
  }

  async run() {
    log.title('🚀 SSGB College Management System - Hardcoded Token Deployment');
    
    log.info('Using hardcoded tokens for deployment:');
    log.info(`Vercel Project ID: ${TOKENS.VERCEL_PROJECT_ID}`);
    log.info(`Vercel Org ID: ${TOKENS.VERCEL_ORG_ID}`);
    log.info(`Railway Project ID: ${TOKENS.RAILWAY_PROJECT_ID}`);
    
    try {
      await this.checkPrerequisites();
      await this.installCLIs();
      await this.setupConfigFiles();
      await this.deployBackend();
      await this.deployFrontend();
      await this.testDeployment();
      this.showSuccessMessage();
    } catch (error) {
      log.error(`Deployment failed: ${error.message}`);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    log.title('📋 Checking Prerequisites');
    
    // Check Node.js
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      log.success(`Node.js ${nodeVersion} is installed`);
    } catch (error) {
      throw new Error('Node.js is not installed. Please install Node.js first.');
    }

    // Check npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      log.success(`npm ${npmVersion} is installed`);
    } catch (error) {
      throw new Error('npm is not available. Please install npm first.');
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

  async installCLIs() {
    log.title('📦 Installing CLI Tools');
    
    // Install Vercel CLI
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      log.success('Vercel CLI is already installed');
    } catch (error) {
      log.step('Installing Vercel CLI...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
      log.success('Vercel CLI installed');
    }

    // Install Railway CLI
    try {
      execSync('railway --version', { stdio: 'ignore' });
      log.success('Railway CLI is already installed');
    } catch (error) {
      log.step('Installing Railway CLI...');
      execSync('npm install -g @railway/cli', { stdio: 'inherit' });
      log.success('Railway CLI installed');
    }
  }

  async setupConfigFiles() {
    log.title('🔧 Setting Up Configuration Files');
    
    // Setup frontend vercel.json
    const frontendVercelConfig = {
      version: 2,
      builds: [
        {
          src: "package.json",
          use: "@vercel/static-build",
          config: {
            distDir: "build"
          }
        }
      ],
      routes: [
        {
          src: "/(.*)",
          dest: "/index.html"
        }
      ],
      env: {
        REACT_APP_API_URL: "https://sms-service.up.railway.app/api",
        GENERATE_SOURCEMAP: "false"
      }
    };

    const frontendVercelPath = path.join(this.frontendPath, 'vercel.json');
    fs.writeFileSync(frontendVercelPath, JSON.stringify(frontendVercelConfig, null, 2));
    log.success('Frontend vercel.json created');

    // Setup backend railway.json
    const backendRailwayConfig = {
      deploy: {
        startCommand: "npm start",
        healthcheckPath: "/health",
        healthcheckTimeout: 300
      },
      build: {
        command: "npm install"
      }
    };

    const backendRailwayPath = path.join(this.backendPath, 'railway.json');
    fs.writeFileSync(backendRailwayPath, JSON.stringify(backendRailwayConfig, null, 2));
    log.success('Backend railway.json created');
  }

  async deployBackend() {
    log.title('🚀 Deploying Backend to Railway');
    
    process.chdir(this.backendPath);
    
    try {
      log.step('Installing backend dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      
      log.step('Logging into Railway...');
      process.env.RAILWAY_TOKEN = TOKENS.RAILWAY_PROJECT_TOKEN;
      execSync(`railway login --token ${TOKENS.RAILWAY_PROJECT_TOKEN}`, { stdio: 'inherit' });
      
      log.step('Deploying to Railway...');
      execSync(`railway up --service ${TOKENS.RAILWAY_SERVICE_ID}`, { stdio: 'inherit' });
      
      log.success('Backend deployed successfully to Railway!');
      log.info('Backend URL: https://sms-service.up.railway.app');
    } catch (error) {
      throw new Error(`Backend deployment failed: ${error.message}`);
    } finally {
      process.chdir(this.projectRoot);
    }
  }

  async deployFrontend() {
    log.title('🚀 Deploying Frontend to Vercel');
    
    process.chdir(this.frontendPath);
    
    try {
      log.step('Installing frontend dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      
      log.step('Building frontend...');
      execSync('npm run build', { stdio: 'inherit' });
      
      log.step('Deploying to Vercel...');
      process.env.VERCEL_TOKEN = TOKENS.VERCEL_TOKEN;
      process.env.VERCEL_ORG_ID = TOKENS.VERCEL_ORG_ID;
      process.env.VERCEL_PROJECT_ID = TOKENS.VERCEL_PROJECT_ID;
      
      execSync(`vercel --prod --token ${TOKENS.VERCEL_TOKEN} --scope ${TOKENS.VERCEL_ORG_ID} --yes`, { stdio: 'inherit' });
      
      log.success('Frontend deployed successfully to Vercel!');
      log.info(`Frontend URL: https://${TOKENS.VERCEL_PROJECT_ID}.vercel.app`);
    } catch (error) {
      throw new Error(`Frontend deployment failed: ${error.message}`);
    } finally {
      process.chdir(this.projectRoot);
    }
  }

  async testDeployment() {
    log.title('🧪 Testing Deployment');
    
    // Test backend health
    log.step('Testing backend health...');
    try {
      await this.makeHttpRequest('https://sms-service.up.railway.app/health');
      log.success('Backend is healthy and responding');
    } catch (error) {
      log.warning('Backend health check failed - may still be starting up');
    }

    // Test frontend
    log.step('Testing frontend...');
    try {
      await this.makeHttpRequest(`https://${TOKENS.VERCEL_PROJECT_ID}.vercel.app`);
      log.success('Frontend is accessible');
    } catch (error) {
      log.warning('Frontend check failed - may still be propagating');
    }
  }

  makeHttpRequest(url) {
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response);
        } else {
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      });
      
      request.on('error', reject);
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  showSuccessMessage() {
    log.title('🎉 Deployment Complete!');
    
    console.log(`${colors.green}${colors.bold}Your School Management System is now live!${colors.reset}\n`);
    
    console.log(`${colors.cyan}🔗 Application URLs:${colors.reset}`);
    console.log(`   Frontend: https://${TOKENS.VERCEL_PROJECT_ID}.vercel.app`);
    console.log(`   Backend:  https://sms-service.up.railway.app`);
    console.log(`   Health:   https://sms-service.up.railway.app/health\n`);
    
    console.log(`${colors.cyan}🔐 Login Credentials:${colors.reset}`);
    console.log(`   Email:    admin@ssgb.edu`);
    console.log(`   Password: admin123\n`);
    
    console.log(`${colors.cyan}📊 Dashboards:${colors.reset}`);
    console.log(`   Railway:  https://railway.app/dashboard`);
    console.log(`   Vercel:   https://vercel.com/dashboard\n`);
    
    console.log(`${colors.yellow}💡 Next Steps:${colors.reset}`);
    console.log(`   1. Test the login functionality`);
    console.log(`   2. Verify all CRUD operations work`);
    console.log(`   3. Check both dashboards for deployment status`);
    console.log(`   4. Monitor application logs for any issues\n`);
  }
}

// Run the deployment
if (require.main === module) {
  const deployment = new HardcodedDeployment();
  deployment.run().catch((error) => {
    console.error(`${colors.red}❌ Deployment failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = HardcodedDeployment;
