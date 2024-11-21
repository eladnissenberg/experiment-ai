// server/index.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios'); // Import axios for proxy
const extractionRoutes = require('./routes/extraction');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Request logging middleware
app.use(morgan('dev'));
app.use(express.json());

// Request details logging
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://www.supporteam.io',
    'http://localhost:5177',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

// In your CORS options
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],  // Added PUT
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');

  console.log('\n🔒 CORS Headers Set:', {
    timestamp: new Date().toISOString(),
    origin: res.getHeader('Access-Control-Allow-Origin'),
    methods: res.getHeader('Access-Control-Allow-Methods'),
    headers: res.getHeader('Access-Control-Allow-Headers')
  });

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

// Response logging middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    console.log('\n📤 Outgoing Response:', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      contentType: res.get('Content-Type')
    });
    return originalSend.call(this, data);
  };
  next();
});

// Import routes
const experimentRoutes = require('./routes/experiments');
const trackingRoutes = require('./routes/tracking');
const healthRoutes = require('./routes/health');

// Special handling for script requests
app.get('/api/v1/experiments/:id/script', (req, res, next) => {
  console.log('\n📜 Script Request:', {
    experimentId: req.params.id,
    origin: req.headers.origin || 'No origin'
  });

  res.set({
    'Content-Type': 'application/javascript',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  });

  next();
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Mount routes
app.use('/api/v1/extraction', extractionRoutes);    
app.use('/api/v1/experiments', experimentRoutes);
app.use('/api/v1/tracking', trackingRoutes);
app.use('/health', healthRoutes);


// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'ExperimentAI API Server',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n❌ Error:', {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    timestamp: new Date().toISOString()
  });
});

// Server startup
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log('\n🚀 Server Details:', {
        timestamp: new Date().toISOString(),
        port: PORT,
        nodeEnv: process.env.NODE_ENV || 'development',
        url: `http://localhost:${PORT}`
      });
    });
  } catch (error) {
    console.error('\n💥 Server Failed to Start:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception:', {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Unhandled Rejection:', {
    timestamp: new Date().toISOString(),
    reason: reason,
    promise: promise
  });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Received SIGTERM - Graceful shutdown initiated');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Received SIGINT - Graceful shutdown initiated');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
