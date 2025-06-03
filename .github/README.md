# GitHub Configuration

This directory contains GitHub-specific configuration files for the SSGB Engineering College Management System.

## 📁 Directory Structure

```
.github/
├── workflows/                  # GitHub Actions CI/CD workflows
│   ├── ci-cd.yml              # Main CI/CD pipeline
│   └── dependency-updates.yml # Automated dependency updates
├── ISSUE_TEMPLATE/            # Issue templates
│   ├── bug_report.md          # Bug report template
│   ├── feature_request.md     # Feature request template
│   └── documentation.md       # Documentation update template
├── CONTRIBUTING.md            # Contributing guidelines
├── CODE_OF_CONDUCT.md         # Community code of conduct
├── SECURITY.md                # Security policy and reporting
├── pull_request_template.md   # Pull request template
├── config.yml                 # Welcome bot configuration
├── FUNDING.yml                # Funding/sponsorship configuration
├── copilot-instructions.md    # AI assistant instructions
└── README.md                  # This file
```

## 🔧 Workflows

### CI/CD Pipeline (`workflows/ci-cd.yml`)
- **Triggers**: Push to main/develop, pull requests to main
- **Jobs**: Test, Security Scan, Deploy
- **Features**:
  - Multi-version Node.js testing (18.x, 20.x)
  - MongoDB service for integration tests
  - Automated security audits
  - Frontend build verification
  - Test coverage reporting

### Dependency Updates (`workflows/dependency-updates.yml`)
- **Schedule**: Weekly on Mondays at 9 AM UTC
- **Features**:
  - Automated dependency checking
  - Security vulnerability scanning
  - Creates issues for outdated packages
  - Audit reports for both frontend and backend

## 📋 Issue Templates

### Bug Report (`ISSUE_TEMPLATE/bug_report.md`)
- Environment details collection
- Step-by-step reproduction guide
- Module-specific categorization
- Priority level assessment

### Feature Request (`ISSUE_TEMPLATE/feature_request.md`)
- User story format
- Technical requirements checklist
- UI/UX considerations
- Acceptance criteria

### Documentation (`ISSUE_TEMPLATE/documentation.md`)
- Documentation type classification
- Target audience identification
- Current issue description
- Proposed improvements

## 📝 Templates

### Pull Request Template (`pull_request_template.md`)
- Change type classification
- Module/component tracking
- Testing requirements
- Review checklist
- Breaking changes documentation

## 📖 Community Guidelines

### Contributing (`CONTRIBUTING.md`)
- Development environment setup
- Code style guidelines
- Git workflow instructions
- Testing requirements
- Review process

### Code of Conduct (`CODE_OF_CONDUCT.md`)
- Community standards
- Reporting procedures
- Enforcement guidelines
- Educational focus

### Security Policy (`SECURITY.md`)
- Vulnerability reporting process
- Response timelines
- Security best practices
- Contact information

## 🤖 Automation

### Welcome Bot (`config.yml`)
- First-time contributor welcome messages
- Issue and PR guidance
- Community onboarding

### Funding (`FUNDING.yml`)
- Sponsorship platform configuration
- Support options for the project

## 🎯 AI Assistant Instructions (`copilot-instructions.md`)
- Environment-specific guidelines
- PowerShell command syntax
- Project structure documentation
- Development workflow rules

## 🚀 Quick Setup

To use these configurations in your fork:

1. **Fork** the repository
2. **Enable Actions** in your repository settings
3. **Configure secrets** for deployment (if needed):
   ```
   Settings → Secrets and variables → Actions
   ```
4. **Review and customize** templates for your use case
5. **Update contact information** in community files

## 🔧 Customization

### For Educational Institutions
- Update college/university branding
- Modify contact information
- Adjust security policies
- Customize issue templates

### For Production Use
- Add deployment secrets
- Configure production environments
- Set up monitoring and alerts
- Enable security scanning

## 📞 Support

For questions about these configurations:
- Create an issue using our templates
- Review our contributing guidelines
- Check existing discussions

---

**Maintained by**: SSGB Engineering College IT Department  
**Last Updated**: June 3, 2025  
**Version**: 1.0
