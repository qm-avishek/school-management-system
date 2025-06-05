const axios = require('axios');

async function debugFrontendConnection() {
  console.log('🔍 Starting Frontend Connection Debug...\n');
  
  const API_URL = 'http://localhost:5000/api';
  console.log(`🔗 API URL: ${API_URL}`);
  
  // Test 1: Health Check
  console.log('\n📋 Test 1: Health Check');
  console.log('─'.repeat(40));  try {
    const response = await axios.get(`${API_URL}/api/health`, {
      timeout: 5000
    });
    console.log('✅ Health check successful!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, response.data);
  } catch (error) {
    console.log('❌ Health check failed!');
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, error.response.data);
    }
  }
  
  // Test 2: Login Request (exact same as frontend)
  console.log('\n📋 Test 2: Login Request');
  console.log('─'.repeat(40));
  try {
    const credentials = {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    };
    
    console.log(`   Credentials:`, credentials);
    
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    
    console.log('✅ Login successful!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Token present: ${!!response.data.token}`);
    console.log(`   Admin:`, response.data.admin);
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log(`   Error message: ${error.message}`);
    if (error.response) {
      console.log(`   Response status: ${error.response.status}`);
      console.log(`   Response data:`, error.response.data);
      console.log(`   Response headers:`, error.response.headers);
    }
    if (error.request) {
      console.log(`   Request made but no response received`);
      console.log(`   Request config:`, {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      });
    }
  }
  
  // Test 3: CORS Preflight
  console.log('\n📋 Test 3: CORS Check');
  console.log('─'.repeat(40));
  try {
    const response = await axios.options(`${API_URL}/auth/login`, {
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
        'Origin': 'http://localhost:3001'
      }
    });
    
    console.log('✅ OPTIONS request successful!');
    console.log(`   Status: ${response.status}`);
    console.log(`   CORS headers:`, {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
    });
    
  } catch (error) {
    console.log('❌ OPTIONS request failed!');
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
    }
  }
  
  console.log('\n🏁 Debug complete!');
}

debugFrontendConnection();
