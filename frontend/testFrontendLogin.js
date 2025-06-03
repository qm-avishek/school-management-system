const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing frontend login request...');
    
    const API_URL = 'http://localhost:5000/api';
    const credentials = {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    };

    console.log('API URL:', API_URL);
    console.log('Credentials:', credentials);
    
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message);
    console.log('Full error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔥 Backend server is not running or not accessible');
    }
  }
}

testLogin();
