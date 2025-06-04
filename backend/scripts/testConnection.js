require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    // Use local MongoDB for CI, Atlas for production
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ssgb_college_test';
    
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 Connection string:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    try {
        console.log('⏳ Attempting to connect...');
        
        // Set a shorter timeout for testing
        const options = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            connectTimeoutMS: 10000,
        };
        
        await mongoose.connect(mongoUri, options);
        console.log('✅ MongoDB connection successful!');
        console.log('📊 Database name:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Available collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('🔌 Connection closed successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('EREFUSED')) {
            console.log('\n🔧 Troubleshooting suggestions:');
            console.log('1. Check your internet connection');
            console.log('2. Verify MongoDB Atlas cluster is running');
            console.log('3. Check network firewall settings');
            console.log('4. Try connecting from MongoDB Compass or Atlas UI');
            console.log('5. Verify the cluster URL is correct');
        }
        
        if (error.message.includes('authentication')) {
            console.log('\n🔧 Authentication issue:');
            console.log('1. Check username and password');
            console.log('2. Verify database user permissions');
            console.log('3. Check IP whitelist in Atlas');
        }
        
        process.exit(1);
    }
}

testConnection();
