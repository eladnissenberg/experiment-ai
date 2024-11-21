const CONFIG = {
  development: {
    API_URL: 'http://localhost:3000',
    DEBUG: true,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    OBSERVER_THROTTLE: 100
  },
  production: {
    API_URL: 'https://your-production-domain.com',
    DEBUG: false,
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 2000,
    OBSERVER_THROTTLE: 250
  }
};

function generateExperimentScript(experimentId, options = {}) {
  const env = process.env.NODE_ENV === 'development' ? 'development' : 'production';
  const config = CONFIG[env];

  return `
    (function() {
      const CONFIG = ${JSON.stringify(config)};
      const experimentId = '${experimentId}';
      
      const debug = {
        log: (...args) => CONFIG.DEBUG && console.log(
          '%cExperimentAI:', 
          'color: blue; font-weight: bold',
          ...args
        ),
        error: (...args) => console.error(
          '%cExperimentAI Error:', 
          'color: red; font-weight: bold',
          ...args
        ),
        warn: (...args) => console.warn(
          '%cExperimentAI Warning:', 
          'color: orange; font-weight: bold',
          ...args
        )
      };

      function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
          if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      }

      async function fetchWithRetry(url, options, attempts = CONFIG.RETRY_ATTEMPTS) {
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Experiment-ID': experimentId,
              'X-Client-Timestamp': new Date().toISOString(),
              ...(options?.headers || {})
            }
          });

          if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
          }

          return await response.json();
        } catch (error) {
          if (attempts > 1) {
            debug.warn(\`Retrying fetch, \${attempts - 1} attempts remaining\`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
            return fetchWithRetry(url, options, attempts - 1);
          }
          throw error;
        }
      }

      const eventTracker = {
        queue: [],
        processing: false,

        async track(eventType, metadata = {}) {
          this.queue.push({
            experimentId,
            eventType,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            metadata,
            userAgent: navigator.userAgent,
            screenSize: \`\${window.innerWidth}x\${window.innerHeight}\`
          });

          if (!this.processing) {
            this.processQueue();
          }
        },

        async processQueue() {
          if (!this.queue.length || this.processing) return;
          this.processing = true;
          
          try {
            while (this.queue.length) {
              const event = this.queue[0];
              await fetchWithRetry(\`\${CONFIG.API_URL}/api/v1/tracking/event\`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(event)
              });
              
              this.queue.shift();
              debug.log('Tracked event:', event.eventType);
            }
          } catch (error) {
            debug.error('Error processing event queue:', error);
          } finally {
            this.processing = false;
          }
        }
      };

      class VariantManager {
        constructor(experiment) {
          this.experiment = experiment;
          this.modifiedElements = new Set();
          this.observer = null;
        }

        getActiveVariant() {
          debug.log('Checking variants:', this.experiment.variants);
          
          // First, try to find an active variant
          const activeVariant = this.experiment.variants?.find(v => 
            v.status === 'active' && v.id !== 'control'
          );

          if (!activeVariant) {
            debug.error('No active variant found');
            return null;
          }

          debug.log('Found active variant:', activeVariant);
          return activeVariant;
        }

        applyVariation = throttle(() => {
          const activeVariant = this.getActiveVariant();
          if (!activeVariant) return;

          if (!activeVariant.elements || !activeVariant.elements.length) {
            return debug.error('Variant has no elements configured');
          }

          let hasNewModifications = false;

          activeVariant.elements.forEach((variantElement, index) => {
            const selector = variantElement.selector || 'h1';
            const elements = document.querySelectorAll(selector);

            debug.log(\`Found \${elements.length} elements matching selector: \${selector}\`);

            elements.forEach((element) => {
              const elementId = element.dataset.experimentId || \`exp-\${experimentId}-\${index}\`;
              element.dataset.experimentId = elementId;

              if (!this.modifiedElements.has(elementId)) {
                const originalStyles = {};
                Object.entries(variantElement.styles || {}).forEach(([key, value]) => {
                  originalStyles[key] = element.style[key];
                  element.style[key] = value;
                });

                element.dataset.originalStyles = JSON.stringify(originalStyles);
                this.modifiedElements.add(elementId);
                hasNewModifications = true;

                debug.log('Modified element:', {
                  id: elementId,
                  selector,
                  tag: element.tagName,
                  original: originalStyles,
                  applied: variantElement.styles
                });

                // Add click tracking
                element.addEventListener('click', () => {
                  eventTracker.track('variant_click', {
                    elementId,
                    variantId: activeVariant.id,
                    selector
                  });
                });
              }
            });
          });

          if (hasNewModifications) {
            eventTracker.track('variant_view', {
              variantId: activeVariant.id,
              elementCount: this.modifiedElements.size
            });
          }
        }, CONFIG.OBSERVER_THROTTLE);

        startObserving() {
          this.observer = new MutationObserver(this.applyVariation);
          this.observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          debug.log('Started observing DOM changes');
        }

        cleanup() {
          if (this.observer) {
            this.observer.disconnect();
          }
          this.modifiedElements.forEach(elementId => {
            const element = document.querySelector(\`[data-experiment-id="\${elementId}"]\`);
            if (element) {
              const originalStyles = JSON.parse(element.dataset.originalStyles || '{}');
              Object.assign(element.style, originalStyles);
              delete element.dataset.experimentId;
              delete element.dataset.originalStyles;
            }
          });
          this.modifiedElements.clear();
          debug.log('Cleaned up experiment modifications');
        }
      }

      async function initializeExperiment() {
        let variantManager;

        try {
          debug.log('Initializing experiment:', experimentId);

          const experiment = await fetchWithRetry(
            \`\${CONFIG.API_URL}/api/v1/experiments/\${experimentId}\`
          );

          debug.log('Fetched experiment:', experiment);

          if (!experiment) {
            throw new Error('Experiment not found');
          }

          if (experiment.status !== 'active') {
            debug.warn('Experiment is not active:', experiment.status);
            return;
          }

          if (!window.location.href.includes(experiment.targetURL)) {
            debug.warn('URL mismatch:', { 
              current: window.location.href, 
              target: experiment.targetURL 
            });
            return;
          }

          variantManager = new VariantManager(experiment);
          variantManager.applyVariation();
          variantManager.startObserving();

          window.addEventListener('beforeunload', () => {
            variantManager.cleanup();
          });

          debug.log('Experiment initialized successfully');
        } catch (error) {
          debug.error('Initialization error:', error);
          variantManager?.cleanup();
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExperiment);
      } else {
        initializeExperiment();
      }
    })();
  `;
}

module.exports = { generateExperimentScript };