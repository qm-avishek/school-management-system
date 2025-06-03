const axios = require('axios');

// Simulate the exact same setup as the frontend
const API_URL = 'http://localhost:5000/api';

// Create axios instance with the same config as frontend
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the same interceptors as frontend
api.interceptors.request.use(
  (config) => {
    console.log('🔍 Request Interceptor triggered');
    console.log('   URL:', config.url);
    console.log('   Method:', config.method);
    console.log('   Headers:', config.headers);
    console.log('   Data:', config.data);
    
    const token = null; // Simulate no token for login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response Interceptor: Success');
    console.log('   Status:', response.status);
    console.log('   Headers:', response.headers);
    console.log('   Data:', response.data);
    return response;
  },
  (error) => {
    console.log('❌ Response Interceptor: Error caught');
    console.log('   Error message:', error.message);
    console.log('   Response status:', error.response?.status);
    console.log('   Response data:', error.response?.data);
    console.log('   Response headers:', error.response?.headers);
    
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized detected - would redirect to login');
    } else if (error.response?.status === 403) {
      console.log('🚫 403 Forbidden detected');
    } else if (error.response?.status >= 500) {
      console.log('🔥 Server error detected');
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timeout detected');
    } else if (!error.response) {
      console.log('🌐 Network error detected');
    }
    return Promise.reject(error);
  }
);

// Simulate the exact authAPI.login call
const authAPI = {
  login: (credentials) => {
    console.log('🔍 authAPI.login called with:', credentials);
    console.log('🔍 Making POST request to: /auth/login');
    console.log('🔍 Base URL:', API_URL);
    return api.post('/auth/login', credentials);
  },
};

async function simulateFrontendLogin() {
  console.log('🚀 Simulating Exact Frontend Login Flow...\n');
  
  try {
    const credentials = {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    };
    
    console.log('📋 Starting AuthContext login...');
    console.log('   Credentials:', credentials);
    
    const response = await authAPI.login(credentials);
    const { token, admin } = response.data;
    
    console.log('\n✅ Login completed successfully!');
    console.log('   Token received:', !!token);
    console.log('   Admin data:', admin);
    console.log('   Would store in localStorage and dispatch success');
    
  } catch (error) {
    console.log('\n❌ Login failed in AuthContext!');
    console.log('   Error message:', error.message);
    console.log('   Error response status:', error.response?.status);
    console.log('   Error response data:', error.response?.data);
    console.log('   Would dispatch failure and show toast');
  }
}

simulateFrontendLogin();
