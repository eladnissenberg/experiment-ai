const express = require('express');
const router = express.Router();
const { validateTrackingEvent } = require('../middleware/validation');
const { trackEvent } = require('../controllers/trackingController');

router.post('/event', validateTrackingEvent, trackEvent);

module.exports = router;
