# Copilot Instructions for School Management System

## Environment Setup
- **OS**: Windows
- **Shell**: PowerShell
- **Command Separator**: Use semicolon (;) instead of && for command chaining
- **Working Directory**: d:\Qualminds\school-management-system

## Workflow Guidelines
1. **No Approval Required**: Execute all necessary actions without asking for permission
2. **Complete Tasks 100%**: Continue working until the assignment is fully completed
3. **No Manual Actions**: Use tools for everything instead of asking user to do manual steps
4. **Comprehensive Testing**: Always verify functionality after implementation
5. **Error Handling**: Fix all errors encountered during development

## Current Project Architecture

### Technology Stack
**Backend (Node.js 18.x):**
- Express.js 4.21.x with CORS and security middleware
- MongoDB Atlas with Mongoose 8.8.x ODM
- JWT authentication with bcryptjs encryption
- File upload support via Multer
- API rate limiting and validation

**Frontend (React 18.3.x):**
- React Router DOM 6.28.x for routing
- Tailwind CSS 3.4.x for styling
- Axios 1.7.x for HTTP requests
- React Hook Form 7.53.x for form handling
- Recharts 2.13.x for data visualization
- Lucide React icons and React Hot Toast notifications

**Database:**
- MongoDB Atlas (Production)
- Local MongoDB (Development)

### Project Structure
```
school-management-system/
├── backend/                 # Express.js API server
│   ├── middleware/         # Auth, validation, CORS
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── scripts/           # Admin seeding, utilities
│   ├── .env.example       # Environment template
│   ├── server.js          # Main server file
│   └── package.json       # Dependencies
│
├── frontend/              # React SPA
│   ├── src/              # React source
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── context/      # State management
│   │   └── utils/        # Helper functions
│   ├── tailwind.config.js
│   └── package.json
│
├── .github/              # CI/CD configuration
│   ├── workflows/        # GitHub Actions
│   └── copilot-instructions.md
│
├── start.ps1             # Local development startup
├── README.md             # Project documentation
└── DATABASE_SETUP.md     # Database configuration guide
```

## Deployment Configuration

### Current Deployment Stack
- **Backend**: Railway (Node.js serverless functions)
- **Frontend**: Vercel (static React build)
- **Database**: MongoDB Atlas (cloud database)
- **CI/CD**: GitHub Actions automated deployment

### GitHub Actions Workflow
**File**: `.github/workflows/combined-deploy.yml`
- **Trigger**: Push to `main` branch only
- **Backend**: Deploys to Railway with environment variables
- **Frontend**: Builds and deploys to Vercel with API URL configuration
- **Health Checks**: Validates backend endpoints post-deployment

### Environment Variables

**Backend Production (.env):**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ssgb_college
JWT_SECRET=production_jwt_secret_key
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://frontend-domain.vercel.app
```

**Frontend Production:**
```env
REACT_APP_API_URL=https://backend-domain.railway.app
GENERATE_SOURCEMAP=false
```

## Development Workflow

### Local Development Commands
```powershell
# Full stack startup
cd "d:\Qualminds\school-management-system"; .\start.ps1

# Backend only
cd "d:\Qualminds\school-management-system\backend"; npm run dev

# Frontend only  
cd "d:\Qualminds\school-management-system\frontend"; npm start

# Database seeding
cd "d:\Qualminds\school-management-system\backend"; npm run seed

# Health check
cd "d:\Qualminds\school-management-system\backend"; npm run health
```

### API Endpoints Structure
**Authentication:**
- `POST /api/auth/login` - Admin login with JWT
- `GET /api/auth/verify` - Token validation

**Student Management:**
- `GET /api/students` - List with pagination/filtering
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Remove student

**Employee Management:**
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Remove employee

**Finance Management:**
- `GET /api/finance/transactions` - Transaction history
- `POST /api/finance/payment` - Record payment
- `GET /api/finance/reports` - Financial analytics

**Library Management:**
- `GET /api/library/books` - Book catalog
- `POST /api/library/books` - Add book
- `POST /api/library/issue` - Issue book to student
- `POST /api/library/return` - Return book

## Authentication & Security

### JWT Token Flow
1. User submits credentials to `/api/auth/login`
2. Backend validates against MongoDB using bcryptjs
3. Returns JWT token with 24h expiration
4. Frontend stores token in context state
5. Protected routes verify token on each request
6. API middleware validates JWT for protected endpoints

### Security Measures
- Password hashing with bcryptjs (salt rounds: 12)
- JWT secret from environment variables
- CORS configured for specific origins
- API rate limiting (100 requests per 15 minutes)
- Input validation using Validator.js
- Protected routes for admin-only operations

## Database Schema

### Core Models (Mongoose)
**Student Model:**
- Personal info: name, email, phone, address
- Academic: studentId, department, year, semester
- Status tracking: enrollment date, active status

**Employee Model:**
- Personal info: name, email, phone, address
- Professional: employeeId, department, position, salary
- Status: hire date, employment status

**Transaction Model:**
- Financial: amount, type, student reference
- Metadata: date, description, payment method

**Library Model:**
- Book info: title, author, ISBN, category
- Inventory: available copies, total copies
- Borrowing: issue/return tracking per student

### Admin Credentials
- **Email**: admin@ssgb.edu
- **Password**: admin123 (change after first login)
- **Role**: Super Admin (full access)

## Code Quality Standards

### Backend Best Practices
- Use async/await for database operations
- Implement proper error handling with try-catch
- Validate input data before processing
- Use Mongoose schemas with validation
- Return consistent JSON response format
- Log important operations for debugging

### Frontend Best Practices
- Use functional components with React hooks
- Implement proper loading states
- Handle errors gracefully with user feedback
- Use React Hook Form for form validation
- Implement responsive design with Tailwind
- Optimize re-renders with useMemo/useCallback

### File Organization
- Keep components small and focused
- Use custom hooks for reusable logic
- Separate API calls in service modules
- Use TypeScript for better type safety (future enhancement)
- Follow consistent naming conventions

## Production Deployment

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] JWT secrets are production-ready
- [ ] CORS origins updated for production
- [ ] Frontend API URLs point to production backend
- [ ] Admin user seeded in production database
- [ ] Health check endpoints responding

### Deployment Process
1. **Code Changes**: Push to `main` branch
2. **Backend Deploy**: GitHub Actions → Railway deployment
3. **Frontend Deploy**: GitHub Actions → Vercel deployment  
4. **Health Check**: Automated verification of `/api/health`
5. **Monitoring**: Check logs in Railway/Vercel dashboards

### Rollback Procedure
- Railway: Revert to previous deployment in dashboard
- Vercel: Revert deployment in project settings
- Database: Restore from Atlas backup if needed
- GitHub: Revert commits and redeploy

## Troubleshooting Guide

### Common Issues
**Database Connection Errors:**
- Verify MongoDB URI format and credentials
- Check Atlas network access whitelist
- Ensure database name exists in connection string

**CORS Errors:**
- Update CORS_ORIGIN in backend environment
- Verify frontend domain matches CORS configuration
- Check for protocol mismatches (http vs https)

**Authentication Failures:**
- Verify JWT_SECRET is consistent across deployments
- Check token expiration settings
- Ensure admin user exists in database

**Build Failures:**
- Check Node.js version compatibility (18.x required)
- Verify all dependencies are properly installed
- Review environment variables for missing values

### Performance Optimization
- Use MongoDB indexes for frequently queried fields
- Implement pagination for large data sets
- Cache static assets with proper headers
- Optimize images and bundle sizes
- Use lazy loading for React components

## Future Enhancements

### Planned Features
- TypeScript migration for better type safety
- ESLint and Prettier for code formatting
- Jest testing suite for backend and frontend
- Docker containerization for consistent deployments
- Redis caching for improved performance
- Email notifications for important operations
- File upload for student/employee photos
- Advanced reporting and analytics dashboard
- Mobile responsive PWA features

### Technical Debt
- Add comprehensive unit and integration tests
- Implement proper logging and monitoring
- Add API documentation with Swagger
- Set up error tracking with Sentry
- Implement database migrations system
- Add backup and restore procedures

## Development Guidelines

### Git Workflow
- Use feature branches for new functionality
- Write descriptive commit messages
- Test changes locally before pushing
- Create pull requests for code review
- Keep commits atomic and focused

### Code Review Standards
- Verify functionality works as expected
- Check for security vulnerabilities
- Ensure code follows project conventions
- Test edge cases and error scenarios
- Validate database operations are efficient

### Documentation Requirements
- Update README for new features
- Document API changes in comments
- Keep environment variable examples current
- Update deployment guides as needed
- Maintain troubleshooting documentation

---

**Last Updated**: June 2025 - Reflect current production architecture and latest dependencies

### Frontend (Vercel)
- `REACT_APP_API_URL`: Backend URL on Vercel
- `GENERATE_SOURCEMAP`: false (for security)

## GitHub Actions Workflow
- **Trigger**: Push to main branch only
- **Jobs**:
  1. **Test Job**: Runs on pull requests
     - Install dependencies
     - Run backend and frontend tests
     - Build frontend for validation
  2. **Deploy Job**: Runs on main branch pushes
     - Deploy backend to Vercel
     - Deploy frontend to Vercel
- **Parallel Deployment**: Deploys both services simultaneously for faster deployment

## Vercel Configuration
### Backend Configuration (vercel.json)
- **Build**: Uses @vercel/node for Node.js API
- **Routes**: Configured for API endpoints (/api/*) and health checks
- **Functions**: 30-second timeout for serverless functions
- **Environment**: Production environment variables

### Frontend Configuration (vercel.json)
- **Build**: Uses @vercel/static-build for React SPA
- **Routes**: SPA routing with fallback to index.html
- **Caching**: Static assets cached for 1 year
- **Build Directory**: React build output directory

## Next Steps Priority
1. Create Vercel projects for backend and frontend
2. Obtain Vercel organization ID and project IDs
3. Set up GitHub repository secrets for Vercel deployment
4. Test complete CI/CD pipeline with a test commit to main
5. Verify production deployments are working correctly
6. Test complete login flow on production environment
7. Monitor Vercel deployment logs for any issues
8. Set up monitoring and health checks for production services

## Vercel Setup Instructions
### Step 1: Create Vercel Account and Projects
1. Sign up at https://vercel.com with GitHub account
2. Import backend project from GitHub repository
3. Import frontend project from GitHub repository
4. Configure environment variables in Vercel dashboard

### Step 2: GitHub Secrets Configuration
Set the following secrets in GitHub repository settings:
- `VERCEL_TOKEN`: Personal access token from Vercel
- `VERCEL_ORG_ID`: Organization ID from Vercel account settings
- `VERCEL_BACKEND_PROJECT_ID`: Project ID from backend project settings
- `VERCEL_FRONTEND_PROJECT_ID`: Project ID from frontend project settings

### Step 3: Environment Variables
#### Backend (Vercel Dashboard):
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Strong JWT secret for production
- `NODE_ENV`: production
- `CORS_ORIGIN`: Frontend domain on Vercel

#### Frontend (Vercel Dashboard):
- `REACT_APP_API_URL`: Backend domain on Vercel
- `GENERATE_SOURCEMAP`: false
