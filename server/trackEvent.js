const express = require("express");
const router = express.Router();

// Store experiment configurations
const experiments = {
  'title-color-test': {
    id: 'title-color-test',
    status: 'active',
    variations: {
      control: { color: null },
      variant: { color: '#FF0000' }
    },
    targetSelector: '.exp-title'
  }
};

router.get("/tracking-script.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(/* tracking script code from above */);
});

// Add endpoint to get experiment configuration
router.get("/experiments/:id", (req, res) => {
  const experiment = experiments[req.params.id];
  if (!experiment) {
    return res.status(404).json({ error: 'Experiment not found' });
  }
  res.json(experiment);
});

module.exports = router;