const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');

const debugLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const admin = await Admin.findOne({ email: 'admin@ssgb.edu' });
    
    if (!admin) {
      console.log('❌ Admin user not found with email: admin@ssgb.edu');
      
      // Let's check what users exist
      const allAdmins = await Admin.find({});
      console.log('📋 All admin users in database:');
      allAdmins.forEach(a => {
        console.log(`  - ID: ${a._id}`);
        console.log(`    Username: ${a.username}`);
        console.log(`    Email: ${a.email}`);
        console.log(`    Full Name: ${a.fullName}`);
        console.log(`    Role: ${a.role}`);
        console.log(`    Is Active: ${a.isActive}`);
        console.log(`    Created: ${a.createdAt}`);
        console.log('    ---');
      });
      
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log(`  - ID: ${admin._id}`);
    console.log(`  - Username: ${admin.username}`);
    console.log(`  - Email: ${admin.email}`);
    console.log(`  - Full Name: ${admin.fullName}`);
    console.log(`  - Role: ${admin.role}`);
    console.log(`  - Is Active: ${admin.isActive}`);
    console.log(`  - Has Password: ${admin.password ? 'Yes' : 'No'}`);
    console.log(`  - Password Length: ${admin.password ? admin.password.length : 0}`);

    // Test password comparison
    console.log('\n🔐 Testing password comparison:');
    const testPassword = 'admin123';
    const isMatch = await admin.comparePassword(testPassword);
    console.log(`  Password "${testPassword}" matches: ${isMatch ? '✅ YES' : '❌ NO'}`);
    
    if (!isMatch) {
      console.log('  Trying with different variations...');
      const variations = ['Admin123', 'ADMIN123', 'admin', 'password'];
      for (const pass of variations) {
        const match = await admin.comparePassword(pass);
        console.log(`  Password "${pass}" matches: ${match ? '✅ YES' : '❌ NO'}`);
      }
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

debugLogin();
