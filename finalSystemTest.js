const axios = require('axios');

async function finalSystemTest() {
  console.log('🚀 SSGB College Management System - Final Integration Test');
  console.log('═'.repeat(60));
  console.log();

  let allTestsPassed = true;

  // Test 1: Backend Health Check
  console.log('📋 Test 1: Backend Health Check');
  console.log('─'.repeat(40));
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend server is running');
    console.log(`   Status: ${response.status}`);
    console.log(`   Database: ${response.data.database.status}`);
    console.log(`   Environment: ${response.data.environment}`);
  } catch (error) {
    console.log('❌ Backend health check failed');
    console.log(`   Error: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 2: Admin Authentication
  console.log('\n📋 Test 2: Admin Authentication');
  console.log('─'.repeat(40));
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful');
    console.log(`   Status: ${response.status}`);
    console.log(`   Admin: ${response.data.admin.fullName} (${response.data.admin.role})`);
    console.log(`   Token: ${response.data.token ? 'Generated' : 'Missing'}`);
    
    // Store token for subsequent tests
    const authToken = response.data.token;
    
    // Test 3: Protected Route Access
    console.log('\n📋 Test 3: Protected Route Access');
    console.log('─'.repeat(40));
    try {
      const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Protected route access successful');
      console.log(`   Profile: ${profileResponse.data.admin.fullName}`);
    } catch (error) {
      console.log('❌ Protected route access failed');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
      allTestsPassed = false;
    }
    
  } catch (error) {
    console.log('❌ Admin login failed');
    console.log(`   Status: ${error.response?.status}`);
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
    allTestsPassed = false;
  }

  // Test 4: Database Connection
  console.log('\n📋 Test 4: Database Operations');
  console.log('─'.repeat(40));
  try {
    // Test admin count
    const adminResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    });
    
    if (adminResponse.data.admin) {
      console.log('✅ Database operations working');
      console.log(`   Admin user found: ${adminResponse.data.admin.email}`);
      console.log(`   Last login: ${new Date(adminResponse.data.admin.lastLogin).toLocaleString()}`);
    }
  } catch (error) {
    console.log('❌ Database operations failed');
    console.log(`   Error: ${error.message}`);
    allTestsPassed = false;
  }

  // Test 5: CORS Configuration
  console.log('\n📋 Test 5: CORS Configuration');
  console.log('─'.repeat(40));
  try {
    const corsResponse = await axios.options('http://localhost:5000/api/auth/login', {
      headers: {
        'Origin': 'http://localhost:3001',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ CORS properly configured');
    console.log(`   Status: ${corsResponse.status}`);
    console.log(`   Allow Origin: ${corsResponse.headers['access-control-allow-origin']}`);
    console.log(`   Allow Methods: ${corsResponse.headers['access-control-allow-methods']}`);
  } catch (error) {
    console.log('❌ CORS configuration failed');
    console.log(`   Error: ${error.message}`);
    allTestsPassed = false;
  }

  // Final Results
  console.log('\n🏁 Final Test Results');
  console.log('═'.repeat(60));
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Backend server operational');
    console.log('✅ Database connection working');
    console.log('✅ Authentication system functional');
    console.log('✅ CORS properly configured');
    console.log('✅ Admin user accessible');
    console.log();
    console.log('🌟 SSGB College Management System is READY!');
    console.log('📱 Frontend: http://localhost:3001');
    console.log('🔐 Admin Credentials: admin@ssgb.edu / admin123');
  } else {
    console.log('❌ SOME TESTS FAILED!');
    console.log('🔧 Please check the failed components above.');
  }
  
  console.log('═'.repeat(60));
}

finalSystemTest();
