const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Atlas Connection...');
console.log('📡 Connection String:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'Not found');

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log('🗄️ Database:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('📊 Ready State:', mongoose.connection.readyState);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Failed to connect to MongoDB Atlas:');
  console.error('🔥 Error:', error.message);
  console.error('\n📋 Troubleshooting:');
  console.error('1. Check if MongoDB Atlas cluster is running');
  console.error('2. Verify username/password in connection string');
  console.error('3. Check IP whitelist in Atlas (0.0.0.0/0 for all IPs)');
  console.error('4. Ensure network access is configured');
  process.exit(1);
});
