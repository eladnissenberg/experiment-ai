const express = require('express');
const router = express.Router();
const DOMExtractionService = require('../../services/domExtraction');
const VariantInjectionService = require('../../services/variantInjection');

// Validate URL middleware 
const validateURL = async (req, res, next) => {
  const url = req.query.url || req.body.url;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  
  try {
    const isValid = await DOMExtractionService.validateURL(url);
    if (!isValid) return res.status(400).json({ error: 'Invalid URL' });
    next();
  } catch (error) {
    res.status(500).json({ error: 'URL validation failed' });
  }
};

// Extract DOM structure
router.get('/extract', validateURL, async (req, res) => {
  try {
    const { url } = req.query;
    const extraction = await DOMExtractionService.extract(url);
    res.json(extraction);
  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: 'DOM extraction failed' });
  }
});

// Generate and inject variant script
router.post('/inject', async (req, res) => {
  try {
    const { experimentId, variant, targetURL } = req.body;
    if (!experimentId || !variant || !targetURL) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const variantKey = await VariantInjectionService.injectVariant(
      experimentId,
      variant,
      targetURL
    );

    res.json({
      variantKey,
      script: VariantInjectionService.getInjectedVariant(variantKey).script
    });
  } catch (error) {
    console.error('Injection error:', error);
    res.status(500).json({ error: 'Variant injection failed' });
  }
});

// Get injected variant script
router.get('/script/:variantKey', (req, res) => {
  try {
    const { variantKey } = req.params;
    const variant = VariantInjectionService.getInjectedVariant(variantKey);
    if (!variant) return res.status(404).json({ error: 'Variant not found' });

    res.setHeader('Content-Type', 'application/javascript');
    res.send(variant.script);
  } catch (error) {
    console.error('Script retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve variant script' });
  }
});

module.exports = router;