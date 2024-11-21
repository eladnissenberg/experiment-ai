const TrackingService = require('../services/trackingService');

exports.trackEvent = async (req, res, next) => {
  try {
    const { eventType, experimentId, timestamp, url } = req.body;
    await TrackingService.trackEvent(eventType, experimentId, timestamp, url);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
