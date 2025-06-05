# SSGB Engineering College Management System

A comprehensive admin dashboard for managing students, employees, finance, and library operations at SSGB Engineering College.

[![CI/CD Pipeline](https://github.com/qm-avishek/school-management-system/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/qm-avishek/school-management-system/actions/workflows/ci-cd.yml)
[![Deployment Ready](https://img.shields.io/badge/Deployment-Ready-brightgreen.svg)](./DEPLOYMENT_COMPLETE.md)
[![GitHub Pages](https://github.com/qm-avishek/school-management-system/actions/workflows/github-pages.yml/badge.svg)](https://github.com/qm-avishek/school-management-system/actions/workflows/github-pages.yml)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qm-avishek/school-management-system&project-name=ssgb-college&repository-name=ssgb-college)
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

## ⚡ Quick Deploy

```bash
# One-command deployment setup
node deploy-setup.js

# Or follow the quick guide
cat QUICK_DEPLOY.md
```

**✨ READY FOR PRODUCTION**: Complete CI/CD pipeline configured!  
**🆓 Free Hosting**: Vercel (Frontend) + Railway (Backend) = $0/month

## 🚀 Features

### Authentication & Security
- JWT-based authentication system
- Role-based access control
- Password encryption with bcrypt
- Protected routes and API endpoints
- Rate limiting for API security

### Student Management
- Complete student registration and profile management
- Academic records tracking
- Department and year-wise organization
- Search and filter capabilities
- Bulk operations support

### Employee Management
- Staff and faculty information management
- Department assignment
- Employee status tracking
- Contact information management

### Finance Management
- Fee collection tracking
- Payment history
- Transaction management
- Financial reporting
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
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd school-management-system
```

### 2. Automatic Setup (Recommended)
Run the setup script to install all dependencies:

**For Windows (PowerShell):**
```powershell
./setup.ps1
```

**For Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Manual Setup

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ssgb_college

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 5. Database Setup

Seed the initial admin user:
```bash
cd backend
node scripts/seedAdmin.js
```

### 6. Start the Application

#### Option 1: Automatic Start (Windows)
```powershell
./start.ps1
```

#### Option 2: Manual Start

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

## 🔑 Default Login Credentials

After seeding the database, use these credentials to log in:

- **Email:** admin@ssgb.edu
- **Password:** admin123

**⚠️ Important:** Change the default password after your first login!

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new admin
- `GET /api/auth/profile` - Get admin profile
- `PUT /api/auth/profile` - Update admin profile

### Student Management
- `GET /api/students` - Get all students (with pagination and filters)
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/stats` - Get student statistics

### Employee Management
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/stats` - Get employee statistics

### Finance Management
- `GET /api/finance/transactions` - Get all transactions
- `POST /api/finance/transactions` - Create new transaction
- `GET /api/finance/transactions/:id` - Get transaction by ID
- `PUT /api/finance/transactions/:id` - Update transaction
- `DELETE /api/finance/transactions/:id` - Delete transaction
- `GET /api/finance/stats` - Get financial statistics

### Library Management
- `GET /api/library/books` - Get all books
- `POST /api/library/books` - Add new book
- `GET /api/library/books/:id` - Get book by ID
- `PUT /api/library/books/:id` - Update book
- `DELETE /api/library/books/:id` - Delete book
- `GET /api/library/borrow-records` - Get borrow records
- `POST /api/library/borrow` - Borrow a book
- `PUT /api/library/return/:id` - Return a book

## 🏗️ Project Structure

```
school-management-system/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── scripts/          # Utility scripts
│   ├── server.js         # Main server file
│   ├── package.json      # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── App.js        # Main app component
│   ├── package.json      # Frontend dependencies
│   └── tailwind.config.js
├── setup.ps1             # Windows setup script
├── start.ps1             # Windows start script
└── README.md             # Project documentation
```

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Modern and professional interface
- **Interactive Charts** - Real-time data visualization
- **Form Validation** - Client-side and server-side validation
- **Toast Notifications** - User feedback for actions
- **Loading States** - Smooth user experience
- **Modal Dialogs** - For forms and confirmations

## 🔧 Development

### Adding New Features

1. **Backend**: Add routes in `/backend/routes/` and models in `/backend/models/`
2. **Frontend**: Add pages in `/frontend/src/pages/` and components in `/frontend/src/components/`
3. **Database**: Update models and run migrations if needed

### Code Style

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for better UX
- Use consistent naming conventions

## 🚀 Deployment

### Quick Deploy (Hybrid Architecture)

**🎯 Our Deployment Stack:**
- **Frontend**: [Vercel](https://vercel.com) (Static React App)
- **Backend**: [Railway](https://railway.app) (Node.js API)
- **Database**: MongoDB Atlas (Cloud Database)

#### Option 1: Automated Setup
```bash
# Run deployment setup script
node deploy-setup.js

# Or use PowerShell on Windows
.\deploy.ps1
```

#### Option 2: Manual Deployment

**📚 Step-by-Step Guide:**

1. **Deploy Backend to Railway**:
   ```bash
   # 1. Create Railway account and link GitHub
   # 2. New Project → Deploy from GitHub repo
   # 3. Select backend folder
   # 4. Set environment variables:
   ```
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_secret_here
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

2. **Deploy Frontend to Vercel**:
   ```bash
   # 1. Create Vercel account and link GitHub
   # 2. New Project → Import repository
   # 3. Set root directory to 'frontend'
   # 4. Add environment variables:
   ```
   ```env
   REACT_APP_API_URL=https://your-backend-domain.railway.app/api
   GENERATE_SOURCEMAP=false
   ```

3. **Configure GitHub Actions**:
   
   **🔧 GitHub Secrets Required:**
   ```
   # Vercel Secrets
   VERCEL_TOKEN=your_vercel_token
   VERCEL_ORG_ID=your_org_id  
   VERCEL_FRONTEND_PROJECT_ID=your_frontend_project_id
   
   # Railway Secrets
   RAILWAY_TOKEN=your_railway_token
   RAILWAY_BACKEND_SERVICE_ID=your_backend_service_id
   ```

4. **GitHub Actions Workflows**:
   - **Frontend**: `.github/workflows/frontend-vercel.yml` (Deploys to Vercel)
   - **Backend**: `.github/workflows/backend-railway.yml` (Deploys to Railway)
   - **Main CI/CD**: `.github/workflows/ci-cd.yml` (Overall testing)

**📖 Documentation:**
- [HYBRID_DEPLOYMENT_SETUP.md](./HYBRID_DEPLOYMENT_SETUP.md) - Complete hybrid setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Legacy deployment options

### Workflow Triggers

#### Frontend Deployment (Vercel)
- **Trigger**: Changes to `frontend/**` files
- **Action**: Automatic build and deploy to Vercel
- **URL**: Updates automatically on each deployment

#### Backend Deployment (Railway)
- **Trigger**: Changes to `backend/**` files  
- **Action**: Automatic build and deploy to Railway
- **Health Check**: `/health` endpoint validation

### Alternative Deployment Options

#### GitHub Pages (Frontend Only)
```bash
# Enable GitHub Pages deployment
git push origin main  # Triggers .github/workflows/github-pages.yml
```

#### Traditional VPS Deployment
```bash
# Backend (Ubuntu/CentOS)
sudo apt update
sudo apt install nginx mongodb nodejs npm
sudo npm install -g pm2

# Clone and setup
git clone <repository>
cd backend && npm install
pm2 start npm --name "ssgb-backend" -- start

# Frontend
cd frontend && npm install && npm run build
# Serve with nginx
```

#### Docker Deployment
```bash
# Build backend image
cd backend
docker build -t ssgb-backend .
docker run -d -p 5000:5000 --env-file .env ssgb-backend

# Frontend with nginx
cd frontend
npm run build
# Use nginx container to serve build files
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database connection secured  
- [ ] JWT secrets are strong and unique
- [ ] CORS properly configured
- [ ] SSL certificates active
- [ ] Error monitoring setup (optional)
- [ ] Database backups configured
- [ ] Health checks working
- [ ] Admin user created

### Monitoring & Maintenance

**Health Checks:**
- Backend: `https://your-backend.railway.app/api/health`
- Frontend: Monitor in Vercel dashboard

**Logs:**
- Railway: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Functions

**Updates:**
- GitHub Actions automatically deploy on push to main
- Manual deploy via platform dashboards
- Database migrations via Railway console

### Cost Breakdown (Free Tier)

| Service | Free Tier | Paid Starts |
|---------|-----------|-------------|
| Vercel | Unlimited projects, 100GB bandwidth | $20/month |
| Railway | $5 credit/month | $5/month |
| MongoDB Atlas | 512MB storage | $9/month |
| GitHub Actions | 2,000 minutes/month | $4/month |

**💰 Total Monthly Cost: $0** (within free tier limits)

### Support & Troubleshooting

**Common Issues:**
- Build failures: Check environment variables
- Database errors: Verify connection strings
- CORS issues: Update backend configuration

**Get Help:**
- [GitHub Issues](../../issues)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: admin@ssgb.edu
- Create an issue in the repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Authentication system
  - Student management
  - Employee management
  - Finance management
  - Library management
  - Dashboard with analytics

---

**SSGB Engineering College Management System** - Streamlining college administration with modern technology.
