const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const healthCheck = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            version: require('../package.json').version,
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
            },
            database: {
                status: 'unknown',
                connection: mongoose.connection.readyState,
                name: mongoose.connection.name || 'not connected'
            }
        };

        // Check database connection
        if (mongoose.connection.readyState === 1) {
            try {
                await mongoose.connection.db.admin().ping();
                healthCheck.database.status = 'connected';
            } catch (dbError) {
                healthCheck.database.status = 'error';
                healthCheck.database.error = dbError.message;
            }
        } else {
            healthCheck.database.status = 'disconnected';
        }

        // Determine overall health status
        if (healthCheck.database.status !== 'connected') {
            healthCheck.status = 'unhealthy';
            return res.status(503).json(healthCheck);
        }

        res.status(200).json(healthCheck);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// Ready check (for Kubernetes/Docker)
app.get('/api/ready', async (req, res) => {
    try {
        // Check if database is ready
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.admin().ping();
            res.status(200).json({ status: 'ready' });
        } else {
            res.status(503).json({ status: 'not ready', reason: 'database not connected' });
        }
    } catch (error) {
        res.status(503).json({ status: 'not ready', reason: error.message });
    }
});

// Liveness check (for Kubernetes/Docker)
app.get('/api/live', (req, res) => {
    res.status(200).json({ 
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = app;
