window.addEventListener('message', (event) => {
    if (event.data.type === 'APPLY_VARIANT') {
      try {
        const { variant } = event.data;
        variant.elements.forEach(({ id, styles }) => {
          const element = document.querySelector(`[data-variant-id="${id}"]`);
          if (element) {
            Object.entries(styles).forEach(([prop, value]) => {
              element.style[prop] = value;
            });
          }
        });
      } catch (error) {
        window.parent.postMessage({
          type: 'ERROR',
          message: error.message
        }, '*');
      }
    }
  });