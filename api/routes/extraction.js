// api/routes/extraction.js
const express = require('express');
const router = express.Router();
const DOMExtractionService = require('../services/domExtraction');

// Constants
const TIMEOUT = 60000; // Increased to 60 seconds
const MAX_URL_LENGTH = 2048;
const DEBUG = process.env.NODE_ENV !== 'production';

// Validation helpers
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

// Enhanced logging middleware
router.use((req, res, next) => {
  console.log('\n🔍 Extraction Request:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    headers: {
      'user-agent': req.headers['user-agent'],
      'origin': req.headers.origin,
      'content-type': req.headers['content-type']
    },
  });
  next();
});

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error('\n❌ Extraction Error:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: DEBUG ? error.stack : undefined,
      path: req.path,
      query: req.query,
    });

    res.status(500).json({
      error: error.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  });
};

// GET /api/v1/extraction/extract
router.get('/extract', asyncHandler(async (req, res) => {
  const { url } = req.query;
  
  console.log('\n📥 Processing extraction request:', {
    url,
    timestamp: new Date().toISOString()
  });

  // Input validation
  if (!url) {
    console.log('❌ Missing URL parameter');
    return res.status(400).json({ 
      error: 'URL parameter is required',
      timestamp: new Date().toISOString(),
    });
  }

  if (!isValidUrl(url)) {
    console.log('❌ Invalid URL format:', url);
    return res.status(400).json({
      error: 'Invalid URL format',
      timestamp: new Date().toISOString(),
    });
  }

  if (url.length > MAX_URL_LENGTH) {
    console.log('❌ URL too long:', url.length);
    return res.status(400).json({
      error: 'URL exceeds maximum length',
      timestamp: new Date().toISOString(),
    });
  }

  // Set CORS headers explicitly
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.header('Access-Control-Max-Age', '86400');

  // Set response timeout
  res.setTimeout(TIMEOUT, () => {
    console.log('⏱️ Request timeout for URL:', url);
    res.status(504).json({
      error: 'Request timeout',
      timestamp: new Date().toISOString(),
    });
  });

  console.log('🌐 Validating URL accessibility...');
  const isValid = await DOMExtractionService.validateURL(url);
  
  if (!isValid) {
    console.log('❌ URL not accessible:', url);
    return res.status(400).json({ 
      error: 'URL is not accessible',
      details: 'The target URL could not be accessed or returned an invalid response',
      timestamp: new Date().toISOString(),
    });
  }

  console.log('🔄 Starting DOM extraction...');
  const result = await DOMExtractionService.extract(url);
  
  if (!result || !result.structure) {
    console.error('❌ Invalid extraction result structure');
    throw new Error('Invalid DOM extraction result');
  }

  console.log('✅ Extraction completed successfully for:', url);

  res.json({
    ...result,
    timestamp: new Date().toISOString(),
    success: true
  });
}));

// GET /api/v1/extraction/validate
router.get('/validate', asyncHandler(async (req, res) => {
  const { url } = req.query;
  
  console.log('\n🔍 Validation request:', {
    url,
    timestamp: new Date().toISOString()
  });

  // Input validation
  if (!url) {
    console.log('❌ Missing URL parameter');
    return res.status(400).json({ 
      error: 'URL parameter is required',
      timestamp: new Date().toISOString(),
    });
  }

  if (!isValidUrl(url)) {
    console.log('❌ Invalid URL format:', url);
    return res.status(400).json({
      error: 'Invalid URL format',
      timestamp: new Date().toISOString(),
    });
  }

  if (url.length > MAX_URL_LENGTH) {
    console.log('❌ URL too long:', url.length);
    return res.status(400).json({
      error: 'URL exceeds maximum length',
      timestamp: new Date().toISOString(),
    });
  }

  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');

  console.log('🔍 Starting URL validation...');
  const isValid = await DOMExtractionService.validateURL(url);
  
  console.log('✅ Validation completed:', { url, isValid });

  res.json({ 
    valid: isValid,
    timestamp: new Date().toISOString(),
    checked: new Date().toISOString()
  });
}));

// Enhanced options handler for CORS
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.header('Access-Control-Max-Age', '86400');
  res.status(204).end();
});

// 404 handler
router.use((req, res) => {
  console.log('❌ Route not found:', req.path);
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;