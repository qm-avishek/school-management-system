# SSGB Engineering College Management System

A comprehensive admin dashboard for managing students, employees, finance, and library operations at SSGB Engineering College.

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

### Backend Deployment
1. Set production environment variables
2. Use process manager like PM2
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables for API endpoints

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
