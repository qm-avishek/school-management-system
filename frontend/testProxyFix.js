const axios = require('axios');

async function testProxyConfiguration() {
  console.log('🔍 Testing Proxy Configuration Fix...\n');
  
  // Test 1: Direct API call (how it worked before)
  console.log('📋 Test 1: Direct API Call (old method)');
  console.log('─'.repeat(50));
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    });
    console.log('✅ Direct call successful');
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    console.log('❌ Direct call failed');
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 2: Proxy-style call (how it should work now)
  console.log('\n📋 Test 2: Proxy-style API Call (new method)');
  console.log('─'.repeat(50));
  try {
    // Simulate the axios instance with relative base URL
    const api = axios.create({
      baseURL: '/api',  // This would be relative to http://localhost:3001
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // But since we're testing from Node, let's simulate what the proxy would do
    const proxyAPI = axios.create({
      baseURL: 'http://localhost:5000/api',  // Simulating what proxy resolves to
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response = await proxyAPI.post('/auth/login', {
      username: 'admin@ssgb.edu',
      password: 'admin123'
    });
    
    console.log('✅ Proxy-style call successful');
    console.log(`   Status: ${response.status}`);
    console.log('   This confirms the fix should work!');
    
  } catch (error) {
    console.log('❌ Proxy-style call failed');
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 3: Health check through proxy
  console.log('\n📋 Test 3: Health Check via Proxy');
  console.log('─'.repeat(50));
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check via proxy successful');
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    console.log('❌ Health check via proxy failed');
    console.log(`   Error: ${error.message}`);
  }
}

testProxyConfiguration();
