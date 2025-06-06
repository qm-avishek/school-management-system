#!/usr/bin/env node

/**
 * Project Validation Script
 * Validates the cleaned up project structure and configuration
 */

const fs = require('fs');
const path = require('path');

class ProjectValidator {
    constructor() {
        this.projectRoot = process.cwd();
        this.errors = [];
        this.warnings = [];
        this.passed = [];
    }

    log(message, type = 'info') {
        const icons = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        console.log(`${icons[type]} ${message}`);
    }    check(description, condition, isWarning = false) {
        if (condition) {
            this.passed.push(description);
            this.log(`${description}`, 'success');
        } else if (isWarning) {
            this.warnings.push(description);
            this.log(`${description}`, 'warning');
        } else {
            this.errors.push(description);
            this.log(`${description}`, 'error');
        }
    }

    fileExists(filePath) {
        return fs.existsSync(path.join(this.projectRoot, filePath));
    }

    directoryExists(dirPath) {
        return fs.existsSync(path.join(this.projectRoot, dirPath)) && 
               fs.statSync(path.join(this.projectRoot, dirPath)).isDirectory();
    }

    async validateProjectStructure() {
        this.log('🔍 Validating Project Structure...', 'info');
        
        // Essential directories
        this.check('Backend directory exists', this.directoryExists('backend'));
        this.check('Frontend directory exists', this.directoryExists('frontend'));
        this.check('GitHub workflows directory exists', this.directoryExists('.github/workflows'));
        
        // Essential files
        this.check('Start script exists', this.fileExists('start.ps1'));
        this.check('README exists', this.fileExists('README.md'));
        this.check('Quick start guide exists', this.fileExists('QUICK_START.md'));
        this.check('Database setup guide exists', this.fileExists('DATABASE_SETUP.md'));
        
        // Backend files
        this.check('Backend server.js exists', this.fileExists('backend/server.js'));
        this.check('Backend package.json exists', this.fileExists('backend/package.json'));
        this.check('Backend health.js exists', this.fileExists('backend/health.js'));
        this.check('API test script exists', this.fileExists('backend/scripts/apiTest.js'));
        
        // Frontend files
        this.check('Frontend package.json exists', this.fileExists('frontend/package.json'));
        this.check('Frontend vercel.json exists', this.fileExists('frontend/vercel.json'));
        this.check('Tailwind config exists', this.fileExists('frontend/tailwind.config.js'));
        
        // Deployment files
        this.check('GitHub Actions workflow exists', this.fileExists('.github/workflows/combined-deploy.yml'));
        this.check('Copilot instructions exist', this.fileExists('.github/copilot-instructions.md'));
    }    async validateCleanup() {
        this.log('🧹 Validating Cleanup...', 'info');
        
        // Check specific files that should be removed
        this.check('No deploy.ps1 in root', !this.fileExists('deploy.ps1'));
        this.check('No setup.ps1 in root', !this.fileExists('setup.ps1'));
        this.check('No completion status files', !this.fileExists('DEPLOYMENT_COMPLETE.md'));
        this.check('No test files in backend', !this.fileExists('backend/test-deployment.js'));
        this.check('No test files in frontend', !this.fileExists('frontend/finalSystemTest.js'));
          // Check for clean directories
        const rootFiles = fs.readdirSync(this.projectRoot);
        const cleanRoot = !rootFiles.some(file => 
            (file.includes('deploy-') || 
            file.includes('setup-') || 
            file.includes('test-') ||
            file.includes('check-')) &&
            file !== 'PROJECT_CLEANUP_COMPLETE.md' &&
            file !== 'validate-project.js'
        );
        this.check('Root directory is clean', cleanRoot);
    }

    async validateConfiguration() {
        this.log('⚙️ Validating Configuration...', 'info');
        
        try {
            // Check backend package.json
            const backendPkg = JSON.parse(
                fs.readFileSync(path.join(this.projectRoot, 'backend/package.json'), 'utf8')
            );
            
            this.check('Backend has start script', !!backendPkg.scripts?.start);
            this.check('Backend has dev script', !!backendPkg.scripts?.dev);
            this.check('Backend has health script', !!backendPkg.scripts?.health);
            this.check('Backend has seed script', !!backendPkg.scripts?.seed);
            this.check('Backend has express dependency', !!backendPkg.dependencies?.express);
            this.check('Backend has mongoose dependency', !!backendPkg.dependencies?.mongoose);
            
            // Check frontend package.json
            const frontendPkg = JSON.parse(
                fs.readFileSync(path.join(this.projectRoot, 'frontend/package.json'), 'utf8')
            );
            
            this.check('Frontend has start script', !!frontendPkg.scripts?.start);
            this.check('Frontend has build script', !!frontendPkg.scripts?.build);
            this.check('Frontend has react dependency', !!frontendPkg.dependencies?.react);
            this.check('Frontend has react-router-dom dependency', !!frontendPkg.dependencies?.['react-router-dom']);
            this.check('Frontend has proxy configured', !!frontendPkg.proxy);
              } catch (error) {
            this.log(`Error reading package.json: ${error.message}`, 'error');
            this.check('Package.json files are valid JSON', false);
        }
    }

    async generateReport() {
        this.log('\n📊 Validation Report', 'info');
        console.log('=' .repeat(50));
        
        this.log(`✅ Passed: ${this.passed.length}`, 'success');
        this.log(`⚠️ Warnings: ${this.warnings.length}`, 'warning');
        this.log(`❌ Errors: ${this.errors.length}`, 'error');
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            this.warnings.forEach(warning => console.log(`  - ${warning}`));
        }
        
        if (this.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        console.log('\n' + '=' .repeat(50));
        
        if (this.errors.length === 0) {
            this.log('🎉 Project validation successful!', 'success');
            this.log('Your project is clean and ready for development.', 'info');
        } else {
            this.log('🔧 Some issues found that need attention.', 'warning');
        }
        
        return this.errors.length === 0;
    }

    async run() {
        this.log('🚀 Starting Project Validation...', 'info');
        console.log('=' .repeat(50));
        
        await this.validateProjectStructure();
        console.log('');
        await this.validateCleanup();
        console.log('');
        await this.validateConfiguration();
        console.log('');
        
        const success = await this.generateReport();
        process.exit(success ? 0 : 1);
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new ProjectValidator();
    validator.run().catch(console.error);
}

module.exports = ProjectValidator;
