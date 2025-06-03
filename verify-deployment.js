#!/usr/bin/env node

/**
 * 🔍 SSGB College Management System - Deployment Verification
 * 
 * This script verifies that all deployment files are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SSGB College Management System - Deployment Verification\n');

const checks = [
  {
    name: 'CI/CD Pipeline',
    file: '.github/workflows/ci-cd.yml',
    required: true
  },
  {
    name: 'GitHub Pages Workflow',
    file: '.github/workflows/github-pages.yml',
    required: false
  },
  {
    name: 'Vercel Configuration',
    file: 'frontend/vercel.json',
    required: true
  },
  {
    name: 'Railway Configuration',
    file: 'backend/railway.json',
    required: true
  },
  {
    name: 'Docker Configuration',
    file: 'backend/Dockerfile',
    required: false
  },
  {
    name: 'Health Check Script',
    file: 'backend/healthcheck.js',
    required: true
  },
  {
    name: 'Backend Environment Template',
    file: 'backend/.env.example',
    required: true
  },
  {
    name: 'Frontend Environment Template',
    file: 'frontend/.env.example',
    required: true
  },
  {
    name: 'Deployment Documentation',
    file: 'DEPLOYMENT.md',
    required: true
  },
  {
    name: 'Quick Deploy Guide',
    file: 'QUICK_DEPLOY.md',
    required: true
  },
  {
    name: 'Auto-generated Instructions',
    file: 'DEPLOY_INSTRUCTIONS.md',
    required: false
  }
];

let passed = 0;
let failed = 0;

console.log('📋 Checking Deployment Files:\n');

checks.forEach(check => {
  const exists = fs.existsSync(check.file);
  
  if (exists) {
    console.log(`✅ ${check.name}`);
    passed++;
  } else {
    if (check.required) {
      console.log(`❌ ${check.name} (REQUIRED - Missing: ${check.file})`);
      failed++;
    } else {
      console.log(`⚠️  ${check.name} (Optional - Missing: ${check.file})`);
    }
  }
});

console.log('\n📊 Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All required deployment files are present!');
  console.log('\n🚀 Your application is ready for deployment!');
  
  console.log('\n📚 Next Steps:');
  console.log('1. Read DEPLOYMENT.md for comprehensive guide');
  console.log('2. Run: node deploy-setup.js for automated setup');
  console.log('3. Follow DEPLOY_INSTRUCTIONS.md for quick deployment');
  console.log('4. Configure GitHub secrets for automated CI/CD');
  
  console.log('\n💰 Free Hosting Stack:');
  console.log('• Frontend: Vercel (Free unlimited)');
  console.log('• Backend: Railway ($5/month credit)');
  console.log('• Database: Railway MongoDB (Included)');
  console.log('• Total: $0/month for starter usage');
  
} else {
  console.log('\n⚠️  Some required files are missing.');
  console.log('Run: node deploy-setup.js to generate missing files');
}

console.log('\n📞 Need Help?');
console.log('• GitHub Issues: https://github.com/qm-avishek/school-management-system/issues');
console.log('• Documentation: DEPLOYMENT.md');
console.log('• Quick Reference: QUICK_DEPLOY.md');

process.exit(failed === 0 ? 0 : 1);
