const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const employeeRoutes = require('./routes/employees');
const financeRoutes = require('./routes/finance');
const libraryRoutes = require('./routes/library');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/library', libraryRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({ 
    message: 'SSGB Engineering College API is running!',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbStatus],
      connected: dbStatus === 1
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ Database connection error:', error.message);
  console.log('⚠️  Server will start without database connection');
  console.log('📋 Please check DATABASE_SETUP.md for configuration instructions');
});

// Start server regardless of database connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SSGB College Server running on port ${PORT}`);
  console.log(`🌐 API Health Check: http://localhost:${PORT}/api/health`);
  if (process.env.NODE_ENV === 'development') {
    console.log(`📱 Frontend should run on: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  }
});

module.exports = app;
