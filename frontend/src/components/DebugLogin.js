import React, { useState } from 'react';
import { authAPI } from '../services/api';

const DebugLogin = () => {
  const [logs, setLogs] = useState([]);
  const [credentials, setCredentials] = useState({
    username: 'admin@ssgb.edu',
    password: 'admin123'
  });

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const testLogin = async () => {
    try {
      setLogs([]);
      addLog('🔍 Starting login test...');
      addLog(`🔍 API URL: ${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}`);
      addLog(`🔍 Credentials: ${JSON.stringify(credentials)}`);
      
      const response = await authAPI.login(credentials);
      
      addLog('✅ Login successful!');
      addLog(`✅ Response status: ${response.status}`);
      addLog(`✅ Response data: ${JSON.stringify(response.data, null, 2)}`);
      
    } catch (error) {
      addLog('❌ Login failed!');
      addLog(`❌ Error message: ${error.message}`);
      addLog(`❌ Error status: ${error.response?.status}`);
      addLog(`❌ Error data: ${JSON.stringify(error.response?.data, null, 2)}`);
      addLog(`❌ Full error: ${JSON.stringify(error, null, 2)}`);
    }
  };

  const testHealthCheck = async () => {
    try {
      setLogs([]);
      addLog('🔍 Testing health check...');
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/api/health`);
      const data = await response.json();
      
      addLog('✅ Health check successful!');
      addLog(`✅ Response status: ${response.status}`);
      addLog(`✅ Response data: ${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      addLog('❌ Health check failed!');
      addLog(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Debug Tool</h1>
        <div style={{ marginBottom: '20px' }}>
        <h3>Environment Info:</h3>
        <p>REACT_APP_API_URL: {process.env.REACT_APP_API_URL || 'undefined'}</p>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
        <p>All REACT_APP vars: {JSON.stringify(Object.keys(process.env).filter(key => key.startsWith('REACT_APP')))}</p>
        <p>Actual API URL: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</p>
        <p>Current domain: {window.location.origin}</p>
        <p>User agent: {navigator.userAgent}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Credentials:</h3>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          style={{ margin: '5px', padding: '5px', width: '200px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          style={{ margin: '5px', padding: '5px', width: '200px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testHealthCheck} style={{ margin: '5px', padding: '10px' }}>
          Test Health Check
        </button>
        <button onClick={testLogin} style={{ margin: '5px', padding: '10px' }}>
          Test Login
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        border: '1px solid #ccc',
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        <h3>Debug Log:</h3>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugLogin;
