exports.validateExperiment = (req, res, next) => {
  const { title, description, targetURL, variations } = req.body;
  
  const errors = [];
  
  if (!title?.trim()) errors.push('Title is required');
  if (!description?.trim()) errors.push('Description is required');
  if (!targetURL?.trim()) errors.push('Target URL is required');
  if (!variations?.variant?.color) errors.push('Variant color is required');
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

exports.validateTrackingEvent = (req, res, next) => {
  const { eventType, experimentId, timestamp, url } = req.body;
  
  const errors = [];
  
  if (!eventType) errors.push('Event type is required');
  if (!experimentId) errors.push('Experiment ID is required');
  if (!timestamp) errors.push('Timestamp is required');
  if (!url) errors.push('URL is required');
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};
