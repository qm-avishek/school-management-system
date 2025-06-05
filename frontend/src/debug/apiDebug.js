// Frontend debugging script to test API communication
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔍 Debug: Environment variables');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('API_URL being used:', API_URL);

// Test API connection
async function testConnection() {
  try {    console.log('🔍 Testing basic connection to:', `${API_URL}/api/health`);
    const response = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Health check response:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Test login endpoint
async function testLogin() {
  try {
    console.log('🔍 Testing login to:', `${API_URL}/auth/login`);
    
    const credentials = {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    };
    
    console.log('Credentials being sent:', credentials);
    
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    
    console.log('✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Login failed!');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    console.log('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔥 Backend server connection refused');
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timeout');
    }
  }
}

// Run tests
console.log('🚀 Starting frontend API debugging...');
testConnection().then(() => testLogin());

export { testConnection, testLogin };
