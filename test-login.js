// Test script to verify login functionality
// Run this in browser console on localhost:3000

async function testLogin() {
  console.log('🧪 Starting login test...');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Login attempt
    console.log('2️⃣ Testing login endpoint...');
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@ssgb.edu',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
      
      // Store token temporarily for testing
      localStorage.setItem('test_token', loginData.token);
      
      // Test 3: Protected route
      console.log('3️⃣ Testing protected route...');
      const protectedResponse = await fetch('/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (protectedResponse.ok) {
        const profileData = await protectedResponse.json();
        console.log('✅ Protected route access successful:', profileData);
      } else {
        console.log('❌ Protected route failed:', protectedResponse.status);
      }
      
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData);
    }
    
  } catch (error) {
    console.error('🚨 Test failed:', error);
  }
}

// Instructions for manual testing
console.log(`
🧪 SSGB College Login Test Script
================================

To test the login system:

1. Open browser console (F12)
2. Navigate to: http://localhost:3000
3. Run: testLogin()
4. Check the console output for results

Admin credentials:
- Username: admin@ssgb.edu  
- Password: admin123

Expected flow:
1. Health check should return API status
2. Login should return token and user data
3. Protected route should work with token
4. Login form should redirect to dashboard

Run testLogin() now to start testing!
`);

// Auto-run if loaded directly
if (window.location.hostname === 'localhost') {
  console.log('🚀 Auto-running login test in 2 seconds...');
  setTimeout(testLogin, 2000);
}
