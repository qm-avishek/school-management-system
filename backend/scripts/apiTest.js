// Test suite for SSGB College Management System API
// This script tests all major API endpoints

require('dotenv').config();
const axios = require('axios');

class APITester {
    constructor(baseURL = 'http://localhost:5000') {
        this.baseURL = baseURL;
        this.token = null;
        this.testResults = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '📋',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        }[type] || '📋';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async test(description, testFn) {
        try {
            this.log(`Testing: ${description}`);
            await testFn();
            this.testResults.passed++;
            this.testResults.tests.push({ description, status: 'PASSED' });
            this.log(`✅ PASSED: ${description}`, 'success');
        } catch (error) {
            this.testResults.failed++;
            this.testResults.tests.push({ 
                description, 
                status: 'FAILED', 
                error: error.message 
            });
            this.log(`❌ FAILED: ${description} - ${error.message}`, 'error');
        }
    }

    async runAllTests() {
        this.log('🚀 Starting API Test Suite for SSGB College Management System');
        this.log(`🌐 Base URL: ${this.baseURL}`);

        // Test 1: Health Check
        await this.test('Health Check Endpoint', async () => {
            const response = await axios.get(`${this.baseURL}/api/health`);
            if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
            if (response.data.status !== 'healthy') throw new Error('Health status is not healthy');
        });

        // Test 2: Admin Login
        await this.test('Admin Login', async () => {
            const response = await axios.post(`${this.baseURL}/api/auth/login`, {
                email: 'admin@ssgb.edu',
                password: 'admin123'
            });
            if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
            if (!response.data.token) throw new Error('No token received');
            this.token = response.data.token;
        });

        // Test 3: Protected Route Access
        await this.test('Token Verification', async () => {
            if (!this.token) throw new Error('No token available from login test');
            const response = await axios.get(`${this.baseURL}/api/auth/verify`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
        });

        // Test 4: Students API
        await this.test('Get Students List', async () => {
            const response = await axios.get(`${this.baseURL}/api/students`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
            if (!Array.isArray(response.data.students)) throw new Error('Students data is not an array');
        });

        // Test 5: Employees API
        await this.test('Get Employees List', async () => {
            const response = await axios.get(`${this.baseURL}/api/employees`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
            if (!Array.isArray(response.data.employees)) throw new Error('Employees data is not an array');
        });

        // Test 6: Finance API
        await this.test('Get Transactions List', async () => {
            const response = await axios.get(`${this.baseURL}/api/finance/transactions`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
            if (!Array.isArray(response.data.transactions)) throw new Error('Transactions data is not an array');
        });

        // Test 7: Library API
        await this.test('Get Books List', async () => {
            const response = await axios.get(`${this.baseURL}/api/library/books`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
            if (!Array.isArray(response.data.books)) throw new Error('Books data is not an array');
        });

        // Test 8: Create Student (if token available)
        if (this.token) {
            await this.test('Create New Student', async () => {
                const testStudent = {
                    name: 'Test Student',
                    email: `test.student.${Date.now()}@test.com`,
                    studentId: `TEST${Date.now()}`,
                    department: 'Computer Science',
                    year: 1,
                    semester: 1,
                    phone: '1234567890',
                    address: 'Test Address'
                };

                const response = await axios.post(`${this.baseURL}/api/students`, testStudent, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                if (response.status !== 201) throw new Error(`Expected 201, got ${response.status}`);
                if (!response.data.student) throw new Error('No student data returned');
            });
        }

        this.printResults();
    }

    printResults() {
        this.log('\n📊 Test Results Summary', 'info');
        this.log(`✅ Passed: ${this.testResults.passed}`, 'success');
        this.log(`❌ Failed: ${this.testResults.failed}`, 'error');
        this.log(`📈 Total Tests: ${this.testResults.tests.length}`);
        
        if (this.testResults.failed > 0) {
            this.log('\n🔍 Failed Tests:', 'warning');
            this.testResults.tests
                .filter(test => test.status === 'FAILED')
                .forEach(test => {
                    this.log(`  ❌ ${test.description}: ${test.error}`, 'error');
                });
        }

        const successRate = ((this.testResults.passed / this.testResults.tests.length) * 100).toFixed(1);
        this.log(`\n🎯 Success Rate: ${successRate}%`);
        
        if (this.testResults.failed === 0) {
            this.log('🎉 All tests passed! API is working correctly.', 'success');
        } else {
            this.log('⚠️ Some tests failed. Please check the API configuration.', 'warning');
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new APITester();
    tester.runAllTests().catch(error => {
        console.error('❌ Test suite failed to run:', error.message);
        process.exit(1);
    });
}

module.exports = APITester;
