const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Find admin user
    const admin = await Admin.findOne({ email: 'admin@ssgb.edu' });
    
    if (admin) {
      console.log('Admin found:');
      console.log('Email:', admin.email);
      console.log('Username:', admin.username);
      console.log('Full Name:', admin.fullName);
      console.log('Role:', admin.role);
      console.log('Created:', admin.createdAt);
      
      // Test password comparison
      const isValidPassword = await admin.comparePassword('admin123');
      console.log('Password "admin123" is valid:', isValidPassword);
    } else {
      console.log('No admin user found with email: admin@ssgb.edu');
      
      // List all admins
      const allAdmins = await Admin.find({});
      console.log('All admins in database:', allAdmins.length);
      allAdmins.forEach(admin => {
        console.log('- Email:', admin.email, 'Username:', admin.username);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkAdmin();
