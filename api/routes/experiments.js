const express = require('express');
const router = express.Router();
const ExperimentService = require('../services/experimentService');
const { validateExperiment } = require('../middleware/validation');
const { generateExperimentScript } = require('../services/scriptGenerator');

// Constants
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Experiment-ID, X-Client-Timestamp',
  'Access-Control-Max-Age': '86400'
};

const SCRIPT_HEADERS = {
  ...CORS_HEADERS,
  'Content-Type': 'application/javascript; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Content-Type-Options': 'nosniff'
};

// Logging middleware
router.use((req, res, next) => {
  console.log('\n🔍 Experiments Route:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query,
    body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined
  });
  next();
});

// Error handler middleware
const handleError = (res, error, customMessage) => {
  console.error(customMessage || 'API Error:', error);
  const status = error.status || 500;
  const message = error.status ? error.message : 'Internal server error';
  res.status(status).json({ error: message });
};

// GET /debug - Show all experiments (development only)
router.get('/debug', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).end();
  }

  try {
    const debugInfo = ExperimentService.debugExperiments();
    console.log('\nDebug Info:', debugInfo);
    res.json(debugInfo);
  } catch (error) {
    handleError(res, error, 'Debug endpoint error');
  }
});

// GET / - Get all experiments
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    console.log('\nDebug - Fetching experiments:', {
      requestedStatus: status,
      page,
      limit,
      sort,
      timestamp: new Date().toISOString()
    });

    const experiments = await ExperimentService.getExperiments(status);
    
    console.log('\nDebug - Query Results:', {
      totalExperiments: experiments.length,
      firstFourExperiments: experiments.slice(0, 4).map(exp => ({
        id: exp.id,
        title: exp.title,
        status: exp.status,
        stage: exp.stage
      })),
      statusDistribution: experiments.reduce((acc, exp) => {
        acc[exp.status] = (acc[exp.status] || 0) + 1;
        return acc;
      }, {})
    });

    res.json(experiments);
  } catch (error) {
    handleError(res, error, 'Error fetching experiments');
  }
});

// GET /:id - Get single experiment
router.get('/:id', async (req, res) => {
  try {
    console.log('\nDebug - Fetching single experiment:', {
      id: req.params.id,
      timestamp: new Date().toISOString()
    });

    const experiment = await ExperimentService.getExperiment(req.params.id);
    
    if (!experiment) {
      console.log('Debug - Experiment not found:', req.params.id);
      return res.status(404).json({ error: 'Experiment not found' });
    }

    console.log('Debug - Found experiment:', {
      id: experiment.id,
      title: experiment.title,
      status: experiment.status,
      stage: experiment.stage
    });

    res.json(experiment);
  } catch (error) {
    handleError(res, error, 'Error fetching experiment');
  }
});

// GET /:id/script - Get experiment script
router.get('/:id/script', async (req, res) => {
  try {
    console.log('\nDebug - Generating script:', {
      experimentId: req.params.id,
      timestamp: new Date().toISOString()
    });
    
    res.set(SCRIPT_HEADERS);

    const experiment = await ExperimentService.getExperiment(req.params.id);
    if (!experiment) {
      console.log('Debug - Script generation failed: Experiment not found');
      return res.status(404)
        .send(`console.error('[ExperimentAI]: Experiment ${req.params.id} not found');`);
    }

    if (experiment.status !== 'active') {
      console.log('Debug - Script generation blocked: Experiment not active');
      return res.status(403)
        .send(`console.warn('[ExperimentAI]: Experiment ${req.params.id} is not currently active');`);
    }

    const script = generateExperimentScript(req.params.id, {
      nonce: req.headers['x-nonce'],
      timeout: 30000,
      customHeaders: {
        'X-Experiment-Version': experiment.version || '1.0.0'
      }
    });

    console.log('Debug - Script generated successfully');
    res.send(script);
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500)
      .send(`console.error('[ExperimentAI]: Failed to initialize experiment - ${error.message}');`);
  }
});

// POST / - Create new experiment
router.post('/', validateExperiment, async (req, res) => {
  try {
    console.log('\nDebug - Creating new experiment:', {
      timestamp: new Date().toISOString(),
      experimentData: {
        title: req.body.title,
        status: req.body.status,
        stage: req.body.stage
      }
    });

    const experiment = await ExperimentService.createExperiment(req.body);
    
    console.log('Debug - Experiment created:', {
      id: experiment.id,
      status: experiment.status,
      stage: experiment.stage
    });

    res.status(201).json(experiment);
  } catch (error) {
    handleError(res, error, 'Error creating experiment');
  }
});

// PUT /:id - Update experiment
router.put('/:id', validateExperiment, async (req, res) => {
  try {
    console.log('\nDebug - Updating experiment:', {
      id: req.params.id,
      timestamp: new Date().toISOString(),
      updates: {
        status: req.body.status,
        stage: req.body.stage
      }
    });

    const experiment = await ExperimentService.updateExperiment(req.params.id, req.body);
    if (!experiment) {
      console.log('Debug - Update failed: Experiment not found');
      return res.status(404).json({ error: 'Experiment not found' });
    }

    console.log('Debug - Experiment updated successfully');
    res.json(experiment);
  } catch (error) {
    handleError(res, error, `Error updating experiment ${req.params.id}`);
  }
});

// PATCH /:id/status - Update experiment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    console.log('\nDebug - Status Update Request:', {
      id: req.params.id,
      newStatus: status,
      timestamp: new Date().toISOString()
    });

    // Validate status values
    const validStatuses = ['draft', 'proposed', 'approved', 'running', 'paused', 'completed'];
    if (!validStatuses.includes(status)) {
      console.log('Debug - Invalid status:', status);
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Map status to stage
    let stage = status;
    if (status === 'running') stage = 'running';
    if (status === 'completed') stage = 'finished';
    if (status === 'proposed') stage = 'proposed';
    if (status === 'approved') stage = 'approved';

    console.log('Debug - Mapped stage:', {
      status,
      stage,
      experimentId: req.params.id
    });

    // Update both status and stage
    const experiment = await ExperimentService.updateExperiment(req.params.id, {
      status,
      stage
    });

    if (!experiment) {
      console.log('Debug - Experiment not found for update');
      return res.status(404).json({ error: 'Experiment not found' });
    }

    console.log('Debug - Updated experiment:', {
      id: experiment.id,
      title: experiment.title,
      newStatus: experiment.status,
      newStage: experiment.stage
    });

    res.json(experiment);
  } catch (error) {
    console.error('Error updating status:', error);
    handleError(res, error, `Error updating experiment status ${req.params.id}`);
  }
});

// DELETE /:id - Delete experiment
router.delete('/:id', async (req, res) => {
  try {
    console.log('\nDebug - Deleting experiment:', {
      id: req.params.id,
      timestamp: new Date().toISOString()
    });

    const wasDeleted = await ExperimentService.deleteExperiment(req.params.id);
    if (!wasDeleted) {
      console.log('Debug - Deletion failed: Experiment not found');
      return res.status(404).json({ error: 'Experiment not found' });
    }

    console.log('Debug - Experiment deleted successfully');
    res.status(204).end();
  } catch (error) {
    handleError(res, error, `Error deleting experiment ${req.params.id}`);
  }
});

// OPTIONS handler for CORS preflight
router.options('*', (req, res) => {
  res.set(CORS_HEADERS).status(204).end();
});

module.exports = router;