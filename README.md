# 🎓 SSGB Engineering College Management System

A modern, comprehensive admin dashboard for managing students, employees, finance, and library operations at SSGB Engineering College.

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-brightgreen.svg)](https://github.com/qm-avishek/school-management-system)
[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ⚡ Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB Atlas account (or local MongoDB)
- Git

### Local Development Setup
```powershell
# Clone the repository
git clone https://github.com/qm-avishek/school-management-system.git
cd school-management-system

# Quick start script
.\start.ps1

# Or manual setup:
# Backend setup
cd backend
npm install
cp .env.example .env
# Configure your .env file with MongoDB URI and JWT secret
npm run seed  # Create admin user
npm run dev   # Start backend on port 5000

# Frontend setup (new terminal)
cd frontend
npm install
npm start     # Start frontend on port 3000
```

**Default Admin Credentials:**
- Email: `admin@ssgb.edu`
- Password: `admin123`

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Staff, Viewer)
- Password encryption using bcryptjs
- API rate limiting and CORS protection
- Secure environment variable management

### 👨‍🎓 Student Management
- Complete student registration and profile management
- Academic records and grade tracking
- Department and year-wise organization
- Advanced search and filtering
- Bulk operations and data export
- Student photo upload and management

### 👨‍💼 Employee Management
- Staff and faculty information management
- Department and role assignment
- Employee status tracking (Active, Inactive, On Leave)
- Contact information and emergency contacts
- Performance tracking and notes

### 💰 Finance Management
- Fee collection and payment tracking
- Multiple payment methods support
- Transaction history and receipts
- Financial reporting and analytics
- Outstanding dues management
- Automated payment reminders

### 📚 Library Management
- Book inventory and catalog management
- Student book issuing and returning
- Due date tracking and fine calculation
- Library member management
- Search and filter books by various criteria
- Book reservation system

### 📊 Dashboard & Analytics
- Real-time statistics and metrics
- Visual charts and graphs using Recharts
- Export data to CSV/PDF formats
- Responsive design for all devices
- Dark/Light theme support
- Multiple payment method support

### Library Management
- Book catalog management
- Book borrowing and return system
- Student borrowing history
- Book availability tracking
- Search and filter books

### Dashboard & Analytics
- Real-time statistics
- Interactive charts and graphs
- Quick action buttons
- System overview
- Performance metrics

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js 18.x
- **Framework:** Express.js 4.21.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, CORS, express-rate-limit
- **File Upload:** Multer
- **Validation:** Validator.js

### Frontend
- **Framework:** React 18.3.x
- **Routing:** React Router DOM 6.28.x
- **HTTP Client:** Axios 1.7.x
- **UI Components:** Custom components with Lucide React icons
- **Styling:** Tailwind CSS 3.4.x
- **Forms:** React Hook Form 7.53.x
- **Notifications:** React Hot Toast
- **Charts:** Recharts 2.13.x
- **Date Handling:** date-fns 4.1.x

### Development Tools
- **Development Server:** Nodemon (backend), React Scripts (frontend)
- **Build Tools:** Webpack (via React Scripts)
- **CSS Processing:** PostCSS, Autoprefixer
- **Version Control:** Git

## 🏗️ Project Structure

```
school-management-system/
├── backend/                 # Express.js backend
│   ├── middleware/         # Authentication & validation middleware
│   ├── models/            # Mongoose data models
│   ├── routes/            # API route handlers
│   ├── scripts/           # Utility scripts (seed data, etc.)
│   ├── .env.example       # Environment variables template
│   ├── server.js          # Express server entry point
│   └── package.json       # Backend dependencies
│
├── frontend/              # React frontend
│   ├── public/           # Static assets
│   ├── src/              # React source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context for state management
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main App component
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── package.json      # Frontend dependencies
│
├── .github/              # GitHub configuration
│   ├── workflows/        # CI/CD GitHub Actions
│   └── copilot-instructions.md # Development guidelines
│
├── start.ps1             # Quick start script for Windows
├── README.md             # This file
└── DATABASE_SETUP.md     # Database setup instructions
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ssgb_college
MONGODB_URI_LOCAL=mongodb://localhost:27017/ssgb_college

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Server
NODE_ENV=development
PORT=5000

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
GENERATE_SOURCEMAP=false

# Environment
NODE_ENV=development
## 🚀 Deployment

### Production Deployment
The application is configured for deployment on:
- **Backend:** Railway (serverless functions)
- **Frontend:** Vercel (static hosting)
- **Database:** MongoDB Atlas

### Automated CI/CD
GitHub Actions workflow automatically:
1. Deploys backend to Railway on push to main branch
2. Deploys frontend to Vercel with backend URL configuration
3. Runs health checks post-deployment

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Student Endpoints
- `GET /api/students` - Get all students (with pagination)
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Employee Endpoints
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Finance Endpoints
- `GET /api/finance/transactions` - Get all transactions
- `POST /api/finance/payment` - Record payment
- `GET /api/finance/reports` - Financial reports

### Library Endpoints
- `GET /api/library/books` - Get all books
- `POST /api/library/books` - Add new book
- `POST /api/library/issue` - Issue book to student
- `POST /api/library/return` - Return book

## 🧪 Testing

### Backend Testing
```powershell
cd backend
npm run test           # Test database connection
npm run seed          # Seed admin user
npm run health        # Check server health
```

### Frontend Testing
```powershell
cd frontend
npm test              # Run React tests
npm run build         # Test production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the coding standards in `.github/copilot-instructions.md`
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation when needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SSGB Engineering College for the requirements and feedback
- Open source community for the amazing tools and libraries
- Contributors who helped improve this project

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Made with ❤️ for SSGB Engineering College**

