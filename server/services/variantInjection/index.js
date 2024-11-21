const crypto = require('crypto');

class VariantInjectionService {
  constructor() {
    this.activeVariants = new Map();
  }

  generateVariantScript(experimentId, variant) {
    return `
      (function() {
        const DEBUG = ${process.env.NODE_ENV === 'development'};
        const debug = msg => DEBUG && console.log('[Variant Injection]:', msg);
        
        function applyStyles(elementId, styles) {
          const element = document.querySelector(\`[data-variant-id="${elementId}"]\`);
          if (!element) return false;
          
          Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value;
          });
          return true;
        }

        function applyAttributes(elementId, attributes) {
          const element = document.querySelector(\`[data-variant-id="${elementId}"]\`);
          if (!element) return false;
          
          Object.entries(attributes).forEach(([name, value]) => {
            if (name !== 'style' && name !== 'id' && name !== 'data-variant-id') {
              element.setAttribute(name, value);
            }
          });
          return true;
        }

        function trackEvent(eventType, elementId) {
          fetch('/api/v1/tracking/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              experimentId: '${experimentId}',
              variantId: '${variant.id}',
              eventType,
              elementId,
              timestamp: new Date().toISOString()
            })
          }).catch(err => debug('Tracking error:', err));
        }

        function initVariant() {
          const elements = ${JSON.stringify(variant.elements)};
          let appliedCount = 0;

          elements.forEach(({ id, styles, attributes }) => {
            if (applyStyles(id, styles)) appliedCount++;
            if (attributes) applyAttributes(id, attributes);
          });

          if (appliedCount > 0) {
            trackEvent('variant_view');
            debug(\`Applied variant to \${appliedCount} elements\`);
          }

          elements.forEach(({ id }) => {
            const element = document.querySelector(\`[data-variant-id="\${id}"]\`);
            if (element) {
              element.addEventListener('click', () => trackEvent('variant_click', id));
            }
          });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initVariant);
        } else {
          initVariant();
        }

        new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            if (mutation.addedNodes.length) initVariant();
          });
        }).observe(document.body, { childList: true, subtree: true });
      })();
    `;
  }

  async injectVariant(experimentId, variant, targetURL) {
    const variantKey = crypto
      .createHash('md5')
      .update(`${experimentId}-${variant.id}-${targetURL}-${Date.now()}`)
      .digest('hex');

    const script = this.generateVariantScript(experimentId, variant);
    this.activeVariants.set(variantKey, {
      experimentId,
      variantId: variant.id,
      script,
      timestamp: new Date().toISOString()
    });

    return variantKey;
  }

  getInjectedVariant(variantKey) {
    return this.activeVariants.get(variantKey);
  }

  removeVariant(variantKey) {
    return this.activeVariants.delete(variantKey);
  }

  clearAllVariants() {
    this.activeVariants.clear();
  }
}

module.exports = new VariantInjectionService();