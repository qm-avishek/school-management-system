# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18.x or higher
- Git
- MongoDB Atlas account (or local MongoDB)

## 1-Minute Setup

### Option 1: Automated Setup (Windows)
```powershell
# Clone and start the application
git clone https://github.com/qm-avishek/school-management-system.git
cd school-management-system
.\start.ps1
```

### Option 2: Manual Setup
```powershell
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed    # Create admin user
npm run dev     # Start backend (port 5000)

# Frontend setup (new terminal)
cd frontend
npm install
npm start       # Start frontend (port 3000)
```

## Default Login
- **URL**: http://localhost:3000
- **Email**: admin@ssgb.edu
- **Password**: admin123

## Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ssgb_college
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## Available Features
- 👨‍🎓 Student Management
- 👨‍💼 Employee Management  
- 💰 Finance Tracking
- � Library Management
- 📊 Dashboard Analytics

## Next Steps
1. Change default admin password
2. Add your first student/employee
3. Explore the dashboard
4. Check out the full README.md for deployment

## Need Help?
- Check the troubleshooting section in README.md
- Create an issue on GitHub
- Review the database setup guide

**Ready in under 60 seconds!** 🎉
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
