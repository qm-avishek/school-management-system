const axios = require('axios');

async function testLoginAndNavigation() {
  console.log('🧪 Testing Login and Navigation Flow...\n');

  try {
    // Simulate the login request that should happen when user submits form
    console.log('📋 Simulating frontend login request...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Login request successful!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Token received: ${!!response.data.token}`);
    console.log(`   Admin: ${response.data.admin.fullName}`);
    
    // Test if we can access protected routes with the token
    console.log('\n📋 Testing protected route access...');
    
    const profileResponse = await axios.get('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${response.data.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Protected route access successful!');
    console.log(`   Profile: ${profileResponse.data.admin.fullName}`);
    
    console.log('\n🎉 Both login and authentication are working!');
    console.log('   The navigation issue is likely in the frontend React logic.');
    console.log('   Check the browser console for any JavaScript errors.');

  } catch (error) {
    console.log('❌ Test failed!');
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, error.response.data);
    }
  }
}

testLoginAndNavigation();
