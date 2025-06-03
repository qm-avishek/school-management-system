const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@ssgb.edu' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create initial admin user
    const admin = new Admin({
      username: 'admin',
      email: 'admin@ssgb.edu',
      password: 'admin123', // This will be hashed automatically by the model
      fullName: 'System Administrator',
      role: 'super_admin',
      permissions: {
        students: true,
        employees: true,
        finance: true,
        library: true
      }
    });

    await admin.save();
    console.log('Initial admin user created successfully');
    console.log('Email: admin@ssgb.edu');
    console.log('Password: admin123');
    console.log('Please change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
