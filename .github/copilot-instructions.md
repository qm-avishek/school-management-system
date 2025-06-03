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

## Project Structure
- **Backend**: d:\Qualminds\school-management-system\backend (Port 5000)
- **Frontend**: d:\Qualminds\school-management-system\frontend (Port 3001)
- **Database**: Local MongoDB (mongodb://localhost:27017/ssgb_college)

## Common Commands
### Backend
```powershell
cd "d:\Qualminds\school-management-system\backend"; npm start
cd "d:\Qualminds\school-management-system\backend"; npm install
cd "d:\Qualminds\school-management-system\backend"; node scripts/seedAdmin.js
```

### Frontend
```powershell
cd "d:\Qualminds\school-management-system\frontend"; npm start
cd "d:\Qualminds\school-management-system\frontend"; npm install
cd "d:\Qualminds\school-management-system\frontend"; npm run build
```

## Current System Status
- **Database**: Local MongoDB installed and running
- **Admin User**: admin@ssgb.edu / admin123
- **Backend**: Express server with CORS and authentication
- **Frontend**: React app with proxy configuration
- **Issue**: Login navigation needs testing and completion

## Development Rules
1. Always use relative API URLs (/api) in frontend
2. Use semicolon (;) for PowerShell command chaining
3. Test all functionality in browser after changes
4. Remove debug console.log statements after testing
5. Implement comprehensive error handling
6. Ensure responsive UI design
7. Complete all CRUD operations testing

## Authentication Flow
1. User submits login form
2. Frontend calls /api/auth/login
3. Backend validates credentials
4. Returns JWT token and user data
5. Frontend stores auth state
6. Navigate to dashboard on success

## Next Steps (Current Priority)
1. Verify both servers are running
2. Test complete login flow in browser
3. Fix any remaining navigation issues
4. Test all dashboard functionality
5. Clean up debug code
6. Complete system integration testing
