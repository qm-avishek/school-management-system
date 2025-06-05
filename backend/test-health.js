const express = require('express');

const app = express();

// Simple health check route for Vercel deployment
app.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is healthy',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Health check route (legacy API endpoint)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'SSGB Engineering College API is running!',
    timestamp: new Date().toISOString(),
    database: 'not connected (test mode)'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Health Check: http://localhost:${PORT}/api/health`);
});
