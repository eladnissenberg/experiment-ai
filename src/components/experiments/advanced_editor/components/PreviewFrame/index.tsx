import React from 'react';
import { Loader2, AlertTriangle, Monitor, Smartphone, Tablet } from 'lucide-react';
import { PreviewFrameProps } from '../../types';
import { isBrowser } from '../../utils/browser';

const DEVICE_SIZES = {
  desktop: 'w-full',
  tablet: 'w-[768px]',
  mobile: 'w-[375px]'
} as const;

const SELECTION_SCRIPT = `
  (function() {
    let hoveredElement = null;
    let selectedElement = null;

    function addSelectionOverlay() {
      const overlay = document.createElement('div');
      overlay.id = 'selection-overlay';
      overlay.style.cssText = 'position: fixed; pointer-events: none; z-index: 10000; border: 2px solid #4A90E2; background: rgba(74, 144, 226, 0.1);';
      document.body.appendChild(overlay);
      return overlay;
    }

    const overlay = addSelectionOverlay();

    function updateOverlay(element) {
      if (!element) {
        overlay.style.display = 'none';
        return;
      }

      const rect = element.getBoundingClientRect();
      overlay.style.display = 'block';
      overlay.style.top = rect.top + 'px';
      overlay.style.left = rect.left + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
    }

    function handleMouseOver(e) {
      hoveredElement = e.target;
      hoveredElement.style.cursor = 'pointer';
      updateOverlay(hoveredElement);
      
      window.parent.postMessage({
        type: 'ELEMENT_HOVER',
        element: {
          tag: hoveredElement.tagName,
          id: hoveredElement.id,
          className: hoveredElement.className,
          text: hoveredElement.textContent?.slice(0, 50)
        }
      }, '*');
    }

    function handleMouseOut() {
      if (hoveredElement) {
        hoveredElement.style.cursor = '';
        hoveredElement = null;
        if (!selectedElement) {
          updateOverlay(null);
        }
      }
    }

    function handleClick(e) {
      e.preventDefault();
      selectedElement = e.target;
      updateOverlay(selectedElement);
      
      const computedStyles = window.getComputedStyle(selectedElement);
      const styles = {};
      for (let style of computedStyles) {
        styles[style] = computedStyles.getPropertyValue(style);
      }

      window.parent.postMessage({
        type: 'ELEMENT_SELECT',
        element: {
          tag: selectedElement.tagName,
          id: selectedElement.id,
          className: selectedElement.className,
          text: selectedElement.textContent?.slice(0, 50),
          styles
        }
      }, '*');
    }

    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
    document.body.addEventListener('click', handleClick);
  })();
`;

const PreviewFrame = ({
  variant,
  targetURL,
  onError,
  onElementSelect,
  onElementHover
}: PreviewFrameProps) => {
  const frameRef = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [deviceMode, setDeviceMode] = React.useState('desktop');
  const [origin, setOrigin] = React.useState('');

  React.useEffect(() => {
    console.log('PreviewFrame mounted with:', {
      variant,
      targetURL,
      loading,
      error
    });
  }, [variant, targetURL, loading, error]);

  React.useEffect(() => {
    if (isBrowser() && targetURL) {
      try {
        const url = new URL(targetURL);
        setOrigin(url.origin);
      } catch {
        const errorMessage = 'Invalid target URL';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    }
  }, [targetURL, onError]);

  const injectStyles = React.useCallback(async () => {
    console.log('Attempting to inject styles:', {
      frameReady: !!frameRef.current?.contentWindow,
      variant
    });

    if (!isBrowser() || !frameRef.current?.contentWindow) {
      console.log('Browser check or frame reference failed');
      return;
    }

    if (variant?.id === 'control') {
      console.log('Control variant detected - skipping style injection');
      return;
    }

    if (!variant || typeof variant !== 'object') {
      console.error('Invalid variant:', variant);
      const error = 'Invalid variant configuration: variant is missing or not an object';
      setError(error);
      onError?.(error);
      return;
    }

    try {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        console.log('Received message from iframe:', event.data);
        if (event.data?.error) {
          const errorMessage = event.data.error;
          setError(errorMessage);
          onError?.(errorMessage);
        }
      };

      const styledElements = variant.elements.map(element => ({
        selector: element.selector || `[data-element-id="${element.id}"]`,
        styles: element.variantStyles
      }));

      const message = {
        type: 'INJECT_STYLES',
        variant: {
          id: variant.id,
          elements: styledElements
        }
      };

      console.log('Sending style injection message:', message);

      frameRef.current.contentWindow.postMessage(
        message,
        origin || '*',
        [channel.port2]
      );
    } catch (err) {
      console.error('Style injection failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to inject styles';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [variant, origin, onError]);

  const injectSelectionScript = React.useCallback(() => {
    if (!frameRef.current?.contentWindow) return;

    const script = document.createElement('script');
    script.textContent = SELECTION_SCRIPT;
    frameRef.current.contentWindow.document.head.appendChild(script);

    const handleMessage = (event) => {
      if (!event.data) return;

      switch (event.data.type) {
        case 'ELEMENT_SELECT':
          onElementSelect?.(event.data.element);
          break;
        case 'ELEMENT_HOVER':
          onElementHover?.(event.data.element);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementSelect, onElementHover]);

  const handleLoad = React.useCallback(() => {
    console.log('Frame loaded, preparing to inject scripts');
    setLoading(false);
    setError(null);
    injectSelectionScript();
    injectStyles();
  }, [injectStyles, injectSelectionScript]);

  const handleError = React.useCallback(() => {
    const errorMessage = 'Failed to load preview';
    console.error(errorMessage);
    setError(errorMessage);
    setLoading(false);
    onError?.(errorMessage);
  }, [onError]);

  const handleDeviceModeChange = (mode) => {
    console.log('Changing device mode to:', mode);
    setDeviceMode(mode);
    const frame = frameRef.current;
    if (frame) {
      const currentSrc = frame.src;
      frame.src = 'about:blank';
      setTimeout(() => {
        frame.src = currentSrc;
      }, 100);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white border rounded-lg">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium">
          {variant?.id === 'control' ? 'Original Website' : 'Preview'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeviceModeChange('desktop')}
            className={`p-1.5 rounded ${
              deviceMode === 'desktop' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
            }`}
            aria-label="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeviceModeChange('tablet')}
            className={`p-1.5 rounded ${
              deviceMode === 'tablet' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
            }`}
            aria-label="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeviceModeChange('mobile')}
            className={`p-1.5 rounded ${
              deviceMode === 'mobile' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
            }`}
            aria-label="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 overflow-hidden relative">
        <div className={`h-full mx-auto transition-all duration-300 ${DEVICE_SIZES[deviceMode]}`}>
          {loading && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          {targetURL && (
            <iframe
              ref={frameRef}
              src={targetURL}
              className="w-full h-full border-0 rounded shadow-lg"
              onLoad={handleLoad}
              onError={handleError}
              title={variant?.id === 'control' ? 'Original Website' : 'Preview'}
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          )}

          {error && (
            <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
              <div className="text-center px-4">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;