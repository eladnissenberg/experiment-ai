const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// Unified CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://www.supporteam.io',
      'http://localhost:5177',
      'http://localhost:3000',
      'https://experiment-ai.vercel.app/', // Your Vercel app URL
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors());

// Response logging middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    console.log('\n📤 Outgoing Response:', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      contentType: res.get('Content-Type'),
    });
    return originalSend.call(this, data);
  };
  next();
});

const experimentRoutes = require('./routes/experiments');
const trackingRoutes = require('./routes/tracking');
const healthRoutes = require('./routes/health');

app.get('/api/v1/experiments/:id/script', (req, res, next) => {
  console.log('\n📜 Script Request:', {
    experimentId: req.params.id,
    origin: req.headers.origin || 'No origin',
  });

  res.set({
    'Content-Type': 'application/javascript',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });

  next();
});

app.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use('/api/v1/experiments', experimentRoutes);
app.use('/api/v1/tracking', trackingRoutes);
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'ExperimentAI API Server',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('\n❌ Error:', {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    timestamp: new Date().toISOString(),
  });
});

// Only start the server if not running on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;

  const startServer = async () => {
    try {
      app.listen(PORT, () => {
        console.log('\n🚀 Server Details:', {
          timestamp: new Date().toISOString(),
          port: PORT,
          nodeEnv: process.env.NODE_ENV || 'development',
          url: `http://localhost:${PORT}`,
        });
      });
    } catch (error) {
      console.error('\n💥 Server Failed to Start:', {
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
      });
      process.exit(1);
    }
  };

  process.on('uncaughtException', (error) => {
    console.error('\n💥 Uncaught Exception:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('\n💥 Unhandled Rejection:', {
      timestamp: new Date().toISOString(),
      reason: reason,
      promise: promise,
    });
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    console.log('\n👋 Received SIGTERM - Graceful shutdown initiated');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('\n👋 Received SIGINT - Graceful shutdown initiated');
    process.exit(0);
  });

  startServer();
}

module.exports = app;
