const express = require("express");
const router = express.Router();

router.get("/tracking-script.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  
  const script = `
    (function() {
      // Create a namespace for our experiment
      window.ExperimentAI = window.ExperimentAI || {};
      
      // Configuration
      const config = {
        debug: true,
        retryAttempts: 3,
        retryDelay: 1000
      };

      // Logging utility
      const log = {
        debug: (...args) => config.debug && console.log('[ExperimentAI]', ...args),
        error: (...args) => config.debug && console.error('[ExperimentAI]', ...args)
      };

      // Safe query selector
      function findElement(selector, maxAttempts = 10) {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          
          function tryFind() {
            const element = document.querySelector(selector);
            if (element) {
              resolve(element);
            } else if (attempts >= maxAttempts) {
              reject(new Error(\`Element \${selector} not found after \${attempts} attempts\`));
            } else {
              attempts++;
              setTimeout(tryFind, 500);
            }
          }
          
          tryFind();
        });
      }

      // Initialize experiment
      async function initializeExperiment() {
        try {
          // Add experiment class to title elements
          const titleElements = document.querySelectorAll('h1, .title, .header-title');
          titleElements.forEach(el => {
            el.classList.add('exp-title');
            log.debug('Added exp-title class to:', el);
          });

          // Determine variation (50/50 split)
          const isVariant = Math.random() < 0.5;
          
          if (isVariant) {
            // Apply variant styles
            const styleTag = document.createElement('style');
            styleTag.textContent = \`
              .exp-title {
                color: #FF0000 !important;
                transition: color 0.3s ease;
              }
            \`;
            document.head.appendChild(styleTag);
            log.debug('Applied variant styles');
          }

          // Watch for new elements
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                  const elements = node.querySelectorAll('h1, .title, .header-title');
                  elements.forEach(el => {
                    el.classList.add('exp-title');
                    log.debug('Added exp-title class to dynamic element:', el);
                  });
                }
              });
            });
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });

          log.debug('Experiment initialized successfully');
          
        } catch (error) {
          log.error('Failed to initialize experiment:', error);
        }
      }

      // Start when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExperiment);
      } else {
        initializeExperiment();
      }
    })();
  `;
  
  res.send(script);
});

module.exports = router;