#!/usr/bin/env node

/**
 * SSGB College Management System - CI/CD Status Dashboard
 * 
 * This script provides a comprehensive overview of the CI/CD pipeline status
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
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
    try {
        return execSync(command, { 
            encoding: 'utf8', 
            stdio: 'pipe',
            ...options 
        }).trim();
    } catch (error) {
        // Command failed, return null to indicate failure
        if (options.verbose) {
            console.error(`Command failed: ${command}`, error.message);
        }
        return null;
    }
}

// Check Git repository status
function checkGitStatus() {
    log(`\n${colors.bold}📊 Git Repository Status${colors.reset}`);
    
    const gitStatus = execCommand('git status --porcelain');
    const currentBranch = execCommand('git branch --show-current');
    const lastCommit = execCommand('git log -1 --pretty=format:"%h - %s (%an, %ar)"');
    const remoteUrl = execCommand('git config --get remote.origin.url');
    
    log(`🌿 Current Branch: ${colors.cyan}${currentBranch}${colors.reset}`);
    log(`📍 Remote URL: ${colors.cyan}${remoteUrl}${colors.reset}`);
    log(`📝 Last Commit: ${colors.dim}${lastCommit}${colors.reset}`);
    
    if (gitStatus) {
        const changes = gitStatus.split('\n');
        log(`⚠️ Uncommitted Changes: ${colors.yellow}${changes.length} file(s)${colors.reset}`);
        changes.slice(0, 5).forEach(change => {
            log(`   ${colors.dim}${change}${colors.reset}`);
        });
        if (changes.length > 5) {
            log(`   ${colors.dim}... and ${changes.length - 5} more${colors.reset}`);
        }
    } else {
        log(`✅ Working tree clean`);
    }
    
    return {
        branch: currentBranch,
        hasChanges: !!gitStatus,
        changeCount: gitStatus ? gitStatus.split('\n').length : 0,
        lastCommit,
        remoteUrl
    };
}

// Check workflow files
function checkWorkflows() {
    log(`\n${colors.bold}🔄 GitHub Workflows${colors.reset}`);
    
    const workflowsPath = path.join(process.cwd(), '.github', 'workflows');
    
    if (!fs.existsSync(workflowsPath)) {
        log(`❌ No workflows directory found`);
        return [];
    }
    
    const workflows = fs.readdirSync(workflowsPath)
        .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
        .map(file => {
            const filePath = path.join(workflowsPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Parse workflow info
            const nameMatch = content.match(/name:\s*([^\n]+)/);
            const triggersMatch = content.match(/on:\s*\n([\s\S]*?)(?=\n\S|\n$)/);
            const jobsMatch = content.match(/jobs:\s*\n([\s\S]*?)(?=\n\S|\n$)/);
            
            let triggers = [];
            if (triggersMatch) {
                if (content.includes('push:')) triggers.push('push');
                if (content.includes('pull_request:')) triggers.push('pull_request');
                if (content.includes('schedule:')) triggers.push('schedule');
                if (content.includes('workflow_dispatch:')) triggers.push('manual');
            }
            
            let jobs = [];
            if (jobsMatch) {
                const jobMatches = jobsMatch[1].match(/^\s+([a-zA-Z0-9_-]+):/gm);
                if (jobMatches) {
                    jobs = jobMatches.map(job => job.trim().replace(':', ''));
                }
            }
            
            return {
                file,
                name: nameMatch ? nameMatch[1].trim() : file,
                triggers,
                jobs,
                size: fs.statSync(filePath).size
            };
        });
    
    workflows.forEach(workflow => {
        log(`📄 ${colors.cyan}${workflow.name}${colors.reset} (${workflow.file})`);
        log(`   🎯 Triggers: ${workflow.triggers.join(', ')}`);
        log(`   ⚙️ Jobs: ${workflow.jobs.join(', ')}`);
        log(`   📊 Size: ${(workflow.size / 1024).toFixed(1)}KB`);
    });
    
    return workflows;
}

// Check deployment configuration
function checkDeploymentConfig() {
    log(`\n${colors.bold}🚀 Deployment Configuration${colors.reset}`);
      const configs = [
        {
            name: 'Vercel (Frontend)',
            path: 'frontend/vercel.json',
            platform: 'vercel'
        },
        {
            name: 'Vercel (Backend)',
            path: 'backend/vercel.json',
            platform: 'vercel'
        },
        {
            name: 'Health Check',
            path: 'backend/healthcheck.js',
            platform: 'monitoring'
        }
    ];
    
    const results = configs.map(config => {
        const exists = fs.existsSync(path.join(process.cwd(), config.path));
        const status = exists ? '✅' : '❌';
        
        log(`${status} ${config.name}: ${colors.dim}${config.path}${colors.reset}`);
        
        if (exists) {
            const stats = fs.statSync(path.join(process.cwd(), config.path));
            log(`   📅 Modified: ${colors.dim}${stats.mtime.toLocaleString()}${colors.reset}`);
        }
        
        return { ...config, exists, status };
    });
    
    return results;
}

// Check environment configuration
function checkEnvironmentConfig() {
    log(`\n${colors.bold}🔧 Environment Configuration${colors.reset}`);
    
    const envFiles = [
        { name: 'Backend Example', path: 'backend/.env.example' },
        { name: 'Backend Local', path: 'backend/.env' },
        { name: 'Frontend Example', path: 'frontend/.env.example' },
        { name: 'Frontend Local', path: 'frontend/.env' }
    ];
    
    envFiles.forEach(envFile => {
        const fullPath = path.join(process.cwd(), envFile.path);
        const exists = fs.existsSync(fullPath);
        const status = exists ? '✅' : '❌';
        
        log(`${status} ${envFile.name}: ${colors.dim}${envFile.path}${colors.reset}`);
        
        if (exists) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
            log(`   📊 Variables: ${colors.dim}${lines.length}${colors.reset}`);
        }
    });
}

// Check dependencies
function checkDependencies() {
    log(`\n${colors.bold}📦 Dependencies Status${colors.reset}`);
    
    const projects = [
        { name: 'Backend', path: 'backend' },
        { name: 'Frontend', path: 'frontend' }
    ];
    
    projects.forEach(project => {
        const packagePath = path.join(process.cwd(), project.path, 'package.json');
        const lockPath = path.join(process.cwd(), project.path, 'package-lock.json');
        
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            const hasLock = fs.existsSync(lockPath);
            
            log(`📦 ${colors.cyan}${project.name}${colors.reset}`);
            log(`   📋 Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
            log(`   🛠️ Dev Dependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
            log(`   🔒 Lock File: ${hasLock ? '✅' : '❌'}`);
              // Check for outdated packages
            const outdatedCheck = execCommand(`cd ${project.path} && npm outdated --json`, { stdio: 'pipe' });
            if (outdatedCheck) {
                try {
                    const outdated = JSON.parse(outdatedCheck);
                    const outdatedCount = Object.keys(outdated).length;
                    if (outdatedCount > 0) {
                        log(`   ⚠️ Outdated: ${colors.yellow}${outdatedCount} package(s)${colors.reset}`);
                    }
                } catch (parseError) {
                    // npm outdated might return non-JSON output or empty result
                    log(`   ${colors.dim}Could not parse outdated packages info${colors.reset}`);
                }
            }
        } else {
            log(`❌ ${project.name}: No package.json found`);
        }
    });
}

// Check recent GitHub Actions runs (if possible)
function checkRecentRuns() {
    log(`\n${colors.bold}📈 Recent Activity${colors.reset}`);
    
    // Check last few commits
    const recentCommits = execCommand('git log --oneline -5');
    if (recentCommits) {
        log(`📝 Recent Commits:`);
        recentCommits.split('\n').forEach(commit => {
            log(`   ${colors.dim}${commit}${colors.reset}`);
        });
    }
    
    // Check if GitHub CLI is available
    const ghAvailable = execCommand('gh --version');
    if (ghAvailable) {
        log(`\n🔍 GitHub CLI detected - checking workflow runs...`);
        const workflowRuns = execCommand('gh run list --limit 5 --json conclusion,status,name,createdAt');
        if (workflowRuns) {
            try {
                const runs = JSON.parse(workflowRuns);                runs.forEach(run => {
                    const status = run.conclusion || run.status;
                    let statusIcon;
                    
                    if (status === 'success') {
                        statusIcon = '✅';
                    } else if (status === 'failure') {
                        statusIcon = '❌';
                    } else if (status === 'in_progress') {
                        statusIcon = '🔄';
                    } else {
                        statusIcon = '⚪';
                    }
                    
                    log(`   ${statusIcon} ${run.name} - ${status} (${new Date(run.createdAt).toLocaleString()})`);
                });            } catch (workflowError) {
                log(`   ${colors.dim}Could not parse workflow runs: ${workflowError.message}${colors.reset}`);
            }
        }
    } else {
        log(`💡 Install GitHub CLI for workflow status: ${colors.cyan}gh${colors.reset}`);
    }
}

// Generate CI/CD health score
function calculateHealthScore(data) {
    let score = 0;
    let maxScore = 0;
    
    // Git status (10 points)
    maxScore += 10;
    if (!data.git.hasChanges) score += 10;
    else if (data.git.changeCount < 5) score += 7;
    else score += 3;
    
    // Workflows (20 points)
    maxScore += 20;
    if (data.workflows.length >= 2) score += 20;
    else if (data.workflows.length === 1) score += 15;
    else score += 5;
    
    // Deployment config (30 points)
    maxScore += 30;
    const deploymentScore = data.deployment.filter(d => d.exists).length;
    score += (deploymentScore / data.deployment.length) * 30;
    
    // Environment (20 points)
    maxScore += 20;
    const envExampleExists = fs.existsSync('backend/.env.example') && fs.existsSync('frontend/.env.example');
    if (envExampleExists) score += 20;
    else score += 10;
    
    // Documentation (20 points)
    maxScore += 20;
    const docs = ['DEPLOYMENT.md', 'README.md', 'DEPLOY_INSTRUCTIONS.md'];
    const existingDocs = docs.filter(doc => fs.existsSync(doc)).length;
    score += (existingDocs / docs.length) * 20;
    
    return Math.round((score / maxScore) * 100);
}

// Main dashboard function
function showDashboard() {
    const startTime = Date.now();
    
    log(`${colors.bold}${colors.blue}🚀 SSGB College Management System - CI/CD Dashboard${colors.reset}`);
    log(`${colors.dim}Generated at: ${new Date().toLocaleString()}${colors.reset}\n`);
    
    // Collect all data
    const data = {
        git: checkGitStatus(),
        workflows: checkWorkflows(),
        deployment: checkDeploymentConfig()
    };
    
    checkEnvironmentConfig();
    checkDependencies();
    checkRecentRuns();
    
    // Calculate health score
    const healthScore = calculateHealthScore(data);
      // Summary
    log(`\n${colors.bold}📊 CI/CD Health Score${colors.reset}`);
    
    let scoreColor;
    if (healthScore >= 80) {
        scoreColor = colors.green;
    } else if (healthScore >= 60) {
        scoreColor = colors.yellow;
    } else {
        scoreColor = colors.red;
    }
    
    log(`${scoreColor}${healthScore}/100${colors.reset}`);
    
    if (healthScore >= 90) {
        log(`🎉 Excellent! Your CI/CD pipeline is well configured.`);
    } else if (healthScore >= 70) {
        log(`👍 Good! A few improvements could be made.`);
    } else if (healthScore >= 50) {
        log(`⚠️ Needs attention. Several issues should be addressed.`);
    } else {
        log(`🚨 Critical issues detected. Immediate action required.`);
    }
    
    // Recommendations
    log(`\n${colors.bold}💡 Recommendations${colors.reset}`);
    
    if (data.git.hasChanges) {
        log(`• Commit pending changes to keep repository clean`);
    }
    
    if (data.workflows.length === 0) {
        log(`• Set up GitHub Actions workflows for automated CI/CD`);
    }
    
    const missingDeployment = data.deployment.filter(d => !d.exists);
    if (missingDeployment.length > 0) {
        log(`• Add missing deployment configs: ${missingDeployment.map(d => d.name).join(', ')}`);
    }
    
    log(`\n${colors.bold}⚡ Quick Actions${colors.reset}`);
    log(`• Run tests: ${colors.cyan}npm test${colors.reset}`);
    log(`• Deploy setup: ${colors.cyan}node deploy-setup.js${colors.reset}`);
    log(`• Monitor deployment: ${colors.cyan}node deployment-monitor.js${colors.reset}`);
    log(`• Check status again: ${colors.cyan}node ci-cd-dashboard.js${colors.reset}`);
    
    const endTime = Date.now();
    log(`\n${colors.dim}Dashboard generated in ${endTime - startTime}ms${colors.reset}`);
}

// CLI handling
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        log(`${colors.bold}SSGB College Management System - CI/CD Dashboard${colors.reset}\n`);
        log(`Usage: node ci-cd-dashboard.js [options]\n`);
        log(`Options:`);
        log(`  --help, -h     Show this help message`);
        log(`  --json         Output results in JSON format`);
        log(`\nThis dashboard provides a comprehensive overview of your CI/CD pipeline status.`);
        process.exit(0);
    }
      if (args.includes('--json')) {
        // Generate JSON output with all collected data
        const jsonData = {
            timestamp: new Date().toISOString(),
            healthScore: calculateHealthScore(data),
            git: checkGitStatus(),
            workflows: checkWorkflows(),
            deployment: checkDeploymentConfig()
        };
        
        console.log(JSON.stringify(jsonData, null, 2));
        process.exit(0);
    }
    
    showDashboard();
}

module.exports = { showDashboard, checkGitStatus, checkWorkflows };
