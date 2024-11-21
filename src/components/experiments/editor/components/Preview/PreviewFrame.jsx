import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { isBrowser } from '@/utils/browser';

const PreviewFrame = ({ targetURL, selectedVariant, onError }) => {
  const frameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const injectStyles = useCallback(() => {
    if (!frameRef.current?.contentWindow || !selectedVariant?.styles) {
      console.log('Skipping injection:', {
        frame: !!frameRef.current?.contentWindow,
        styles: !!selectedVariant?.styles
      });
      return;
    }

    try {
      frameRef.current.contentWindow.postMessage({
        type: 'STYLE_UPDATE',
        styles: {
          color: selectedVariant.styles.color || '#000000',
          fontSize: selectedVariant.styles.fontSize || '48px',
          fontWeight: selectedVariant.styles.fontWeight || '600',
          fontFamily: selectedVariant.styles.fontFamily || 'Inter',
          selectors: ['h1', '.header-title', '.hero-title', '#hero-title', '.headline']
        }
      }, '*');
    } catch (err) {
      console.error('Style injection error:', err);
      onError?.('Failed to apply styles');
    }
  }, [selectedVariant, onError]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'STYLE_READY') {
        injectStyles();
      }
    };

    if (isClient) {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isClient, injectStyles]);

  useEffect(() => {
    if (isClient && !isLoading) {
      const timer = setInterval(injectStyles, 1000);
      return () => clearInterval(timer);
    }
  }, [isClient, isLoading, injectStyles]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    injectStyles();
  }, [injectStyles]);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      <iframe
        ref={frameRef}
        src={targetURL}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={() => {
          setError('Failed to load preview');
          setIsLoading(false);
          onError?.('Failed to load preview');
        }}
        title="Preview"
      />

      {error && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
          <div className="text-center px-4">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewFrame;