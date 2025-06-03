# Quick Start Guide - SSGB Engineering College Management System

## 🚀 5-Minute Setup Guide

### Step 1: Install Dependencies
```powershell
# Run in PowerShell from the project root
./setup.ps1
```

### Step 2: Configure Database
1. Make sure MongoDB is running on your system
2. The default connection is: `mongodb://localhost:27017/ssgb_college`
3. If you're using MongoDB Atlas, update the connection string in `backend/.env`

### Step 3: Create Initial Admin User
```powershell
cd backend
npm run seed
```

### Step 4: Start the Application
```powershell
# Go back to project root
cd ..
./start.ps1
```

### Step 5: Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Login with: admin@ssgb.edu / admin123

## 🔧 Manual Installation (Alternative)

If the scripts don't work, follow these steps:

### Backend Setup
```powershell
cd backend
npm install
node scripts/seedAdmin.js
npm run dev
```

### Frontend Setup (in new terminal)
```powershell
cd frontend
npm install
npm start
```

## 🌐 MongoDB Setup Options

### Option 1: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Use default connection string in `.env`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## 🔑 First Login
1. Go to http://localhost:3000
2. Click "Login"
3. Enter:
   - Email: admin@ssgb.edu
   - Password: admin123
4. **Important**: Change password after first login!

## 🎯 Key Features to Test

### Dashboard
- View student/employee statistics
- Check recent transactions
- See library activity

### Student Management
- Add new students
- Search and filter
- View student details
- Update information

### Employee Management
- Add staff/faculty
- Manage departments
- Track employee status

### Finance
- Record fee payments
- Track transactions
- View financial reports

### Library
- Add books to catalog
- Manage book borrowing
- Track returns
- Search books

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use:**
```powershell
# Kill processes on ports 3000 and 5000
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database permissions

**Dependencies Not Installing:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall
- Check Node.js version (requires v14+)

### Reset Database
```powershell
cd backend
# Drop the database and recreate admin
node -e "require('mongoose').connect('mongodb://localhost:27017/ssgb_college').then(() => require('mongoose').connection.dropDatabase()).then(() => process.exit())"
npm run seed
```

## 📱 Mobile Testing
- Open http://localhost:3000 on mobile browser
- Test responsive design
- Check touch interactions

## 🔐 Security Notes
- Change default admin password
- Use strong JWT secret in production
- Enable HTTPS in production
- Implement rate limiting
- Validate all inputs

## 📞 Need Help?
- Check the main README.md for detailed documentation
- Review API endpoints in the documentation
- Check browser console for frontend errors
- Check terminal output for backend errors

---

**Happy Coding! 🎉**
