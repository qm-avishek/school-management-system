# Contributing to SSGB Engineering College Management System

Thank you for your interest in contributing to the SSGB Engineering College Management System! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18.x or 20.x
- **MongoDB**: Version 8.0 or later
- **Git**: Latest version
- **Windows PowerShell** (for Windows development)

### Development Environment Setup

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd school-management-system
   ```

2. **Install dependencies**
   ```powershell
   # Backend
   cd backend; npm install
   
   # Frontend
   cd frontend; npm install
   ```

3. **Environment Configuration**
   ```powershell
   # Backend .env
   MONGODB_URI=mongodb://localhost:27017/ssgb_college
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   
   # Frontend .env
   REACT_APP_API_URL=/api
   ```

4. **Start development servers**
   ```powershell
   # Backend (Terminal 1)
   cd backend; npm start
   
   # Frontend (Terminal 2)
   cd frontend; npm start
   ```

## 📋 Development Guidelines

### Code Style
- **JavaScript/React**: Follow ES6+ standards
- **File Naming**: Use camelCase for files, PascalCase for React components
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Comments**: Use JSDoc for functions

### Git Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** changes with descriptive messages
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Submit** a pull request

### Commit Message Format
```
type(scope): description

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality
fix(dashboard): resolve student count display issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests
```powershell
# Backend tests
cd backend; npm test

# Frontend tests
cd frontend; npm test

# Coverage report
cd frontend; npm test -- --coverage
```

### Test Requirements
- **Unit tests** for new functions
- **Integration tests** for API endpoints
- **Component tests** for React components
- **Minimum 80% code coverage**

## 📂 Project Structure

```
school-management-system/
├── backend/                 # Express.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── scripts/            # Utility scripts
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
└── .github/                # GitHub configuration
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment details** (OS, Node.js version, browser)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Error messages** (full stack trace)

## ✨ Feature Requests

For new features, please provide:
- **Clear description** of the feature
- **Use case** and benefits
- **Proposed implementation** (if applicable)
- **UI/UX mockups** (if applicable)

## 🔍 Code Review Process

### For Contributors
- Ensure your PR follows the pull request template
- Write clear commit messages
- Add tests for new functionality
- Update documentation as needed
- Respond promptly to reviewer feedback

### For Reviewers
- Check code quality and standards
- Verify functionality works as expected
- Ensure no security vulnerabilities
- Consider performance impact
- Validate test coverage

## 📚 Module-Specific Guidelines

### Frontend (React)
- Use functional components with hooks
- Implement proper error boundaries
- Follow responsive design principles
- Use proper state management (Context API)
- Implement loading states and error handling

### Backend (Express.js)
- Use middleware for common functionality
- Implement proper error handling
- Validate input data
- Use JWT for authentication
- Follow RESTful API conventions

### Database (MongoDB)
- Use Mongoose for schema definition
- Implement proper indexing
- Follow data validation rules
- Use transactions for complex operations

## 🚀 Deployment

### Development
- Use `npm start` for development servers
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production
- Run `npm run build` for frontend
- Use environment variables for configuration
- Ensure MongoDB is properly configured
- Set up reverse proxy (nginx recommended)

## 📞 Getting Help

- **Issues**: Create a GitHub issue for bugs or questions
- **Discussions**: Use GitHub Discussions for general questions
- **Documentation**: Check existing documentation first

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Recognition

Contributors will be recognized in:
- Project README.md
- Release notes
- Contributors list

Thank you for contributing to the SSGB Engineering College Management System! 🎓
