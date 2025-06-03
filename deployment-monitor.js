#!/usr/bin/env node

/**
 * SSGB College Management System - Deployment Monitoring
 * 
 * This script monitors deployment health and provides deployment analytics
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    endpoints: {
        // These will be updated after deployment
        frontend: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
        backend: process.env.BACKEND_URL || 'https://your-app.railway.app',
        healthCheck: '/health'
    },
    timeout: 10000,
    retries: 3
};

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

// HTTP request helper
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const isHttps = url.startsWith('https://');
        const client = isHttps ? https : http;
        
        const req = client.request(url, {
            timeout: config.timeout,
            ...options
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data,
                    url: url
                });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// Check endpoint health
async function checkEndpoint(name, url, expectedStatus = 200) {
    log(`\n🔍 Checking ${name}...`, colors.blue);
    
    for (let attempt = 1; attempt <= config.retries; attempt++) {
        try {
            const startTime = Date.now();
            const response = await makeRequest(url);
            const responseTime = Date.now() - startTime;
            
            if (response.statusCode === expectedStatus) {
                log(`✅ ${name} is healthy`, colors.green);
                log(`   📍 URL: ${url}`, colors.cyan);
                log(`   📊 Status: ${response.statusCode}`, colors.cyan);
                log(`   ⏱️ Response Time: ${responseTime}ms`, colors.cyan);
                return { status: 'healthy', responseTime, url };
            } else {
                log(`⚠️ ${name} returned status ${response.statusCode}`, colors.yellow);
            }
        } catch (error) {
            log(`❌ ${name} check failed (attempt ${attempt}/${config.retries}): ${error.message}`, colors.red);
            
            if (attempt === config.retries) {
                return { status: 'unhealthy', error: error.message, url };
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// Check GitHub Actions status
async function checkGitHubActions() {
    log(`\n🔍 Checking GitHub Actions...`, colors.blue);
    
    try {
        // Check if .github/workflows directory exists
        const workflowsPath = path.join(process.cwd(), '.github', 'workflows');
        
        if (!fs.existsSync(workflowsPath)) {
            log(`❌ No GitHub workflows found`, colors.red);
            return { status: 'not-configured' };
        }
        
        const workflows = fs.readdirSync(workflowsPath).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
        
        log(`✅ Found ${workflows.length} workflow(s):`, colors.green);
        workflows.forEach(workflow => {
            log(`   📄 ${workflow}`, colors.cyan);
        });
        
        return { status: 'configured', workflows };
    } catch (error) {
        log(`❌ GitHub Actions check failed: ${error.message}`, colors.red);
        return { status: 'error', error: error.message };
    }
}

// Check deployment files
function checkDeploymentFiles() {
    log(`\n🔍 Checking deployment files...`, colors.blue);
    
    const requiredFiles = [
        'backend/Dockerfile',
        'backend/railway.json',
        'frontend/vercel.json',
        '.github/workflows/ci-cd.yml',
        'backend/.env.example',
        'frontend/.env.example'
    ];
    
    const results = [];
    
    requiredFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        const exists = fs.existsSync(filePath);
        
        if (exists) {
            log(`✅ ${file}`, colors.green);
        } else {
            log(`❌ ${file} (missing)`, colors.red);
        }
        
        results.push({ file, exists });
    });
    
    return results;
}

// Generate deployment report
function generateReport(results) {
    const timestamp = new Date().toISOString();
    
    const report = {
        timestamp,
        version: '1.0.0',
        project: 'SSGB College Management System',
        results: results,
        summary: {
            healthy: results.filter(r => r.status === 'healthy').length,
            unhealthy: results.filter(r => r.status === 'unhealthy').length,
            total: results.length
        }
    };
    
    // Save report
    const reportPath = path.join(process.cwd(), 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    log(`\n📊 Report saved to: deployment-report.json`, colors.cyan);
    
    return report;
}

// Main monitoring function
async function monitorDeployment() {
    log(`${colors.bold}🚀 SSGB College Management System - Deployment Monitor${colors.reset}`);
    log(`${colors.blue}Started at: ${new Date().toLocaleString()}${colors.reset}\n`);
    
    const results = [];
    
    // Check deployment files
    log(`${colors.bold}📁 Deployment Files${colors.reset}`);
    const fileResults = checkDeploymentFiles();
    results.push(...fileResults.map(f => ({ name: f.file, ...f })));
    
    // Check GitHub Actions
    const actionsResult = await checkGitHubActions();
    results.push({ name: 'GitHub Actions', ...actionsResult });
    
    // Check endpoints (if URLs are configured)
    if (config.endpoints.frontend !== 'https://your-app.vercel.app') {
        const frontendResult = await checkEndpoint('Frontend', config.endpoints.frontend);
        results.push({ name: 'Frontend', ...frontendResult });
    }
    
    if (config.endpoints.backend !== 'https://your-app.railway.app') {
        const backendResult = await checkEndpoint('Backend API', config.endpoints.backend + '/api');
        results.push({ name: 'Backend API', ...backendResult });
        
        const healthResult = await checkEndpoint('Backend Health', config.endpoints.backend + config.endpoints.healthCheck);
        results.push({ name: 'Backend Health', ...healthResult });
    }
    
    // Generate report
    const report = generateReport(results);
    
    // Summary
    log(`\n${colors.bold}📊 Summary${colors.reset}`);
    log(`✅ Healthy: ${report.summary.healthy}`, colors.green);
    log(`❌ Issues: ${report.summary.unhealthy}`, colors.red);
    log(`📊 Total Checks: ${report.summary.total}`, colors.blue);
    
    if (report.summary.unhealthy === 0) {
        log(`\n🎉 All systems operational!`, colors.green);
    } else {
        log(`\n⚠️ Some issues detected. Check the results above.`, colors.yellow);
    }
    
    // Usage instructions
    log(`\n${colors.bold}💡 Usage Instructions:${colors.reset}`);
    log(`• Update URLs in deployment-monitor.js after deployment`);
    log(`• Run: node deployment-monitor.js`);
    log(`• Schedule with cron for continuous monitoring`);
    log(`• Check deployment-report.json for detailed results`);
}

// CLI handling
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        log(`${colors.bold}SSGB College Management System - Deployment Monitor${colors.reset}\n`);
        log(`Usage: node deployment-monitor.js [options]\n`);
        log(`Options:`);
        log(`  --help, -h     Show this help message`);
        log(`  --config       Show current configuration`);
        log(`\nEnvironment Variables:`);
        log(`  FRONTEND_URL   Frontend deployment URL`);
        log(`  BACKEND_URL    Backend deployment URL`);
        process.exit(0);
    }
    
    if (args.includes('--config')) {
        log(`${colors.bold}Current Configuration:${colors.reset}`);
        log(JSON.stringify(config, null, 2));
        process.exit(0);
    }
    
    monitorDeployment().catch(error => {
        log(`\n❌ Monitoring failed: ${error.message}`, colors.red);
        process.exit(1);
    });
}

module.exports = { monitorDeployment, checkEndpoint, config };
