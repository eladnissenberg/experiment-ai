// hooks/usePreviewFrame.js
import { useState, useEffect, useCallback, useRef } from 'react';

export const usePreviewFrame = (targetURL, selectedVariant) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const frameRef = useRef(null);

  // Function to inject styles into the iframe
  const injectStyles = useCallback((styles) => {
    if (!frameRef.current) return;

    const frame = frameRef.current;
    const frameDocument = frame.contentDocument || frame.contentWindow.document;

    // Remove any previously injected style tag
    const existingStyle = frameDocument.getElementById('experiment-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    if (!styles || Object.keys(styles).length === 0) return;

    // Create and inject new style tag
    const styleTag = frameDocument.createElement('style');
    styleTag.id = 'experiment-styles';
    styleTag.textContent = `
      h1 {
        color: ${styles.color} !important;
        transition: color 0.3s ease;
      }
    `;
    frameDocument.head.appendChild(styleTag);
  }, []);

  // Handle iframe load event
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    if (selectedVariant?.styles) {
      injectStyles(selectedVariant.styles);
    }
  }, [selectedVariant, injectStyles]);

  // Handle iframe error
  const handleError = useCallback((error) => {
    setError('Failed to load preview');
    setIsLoading(false);
    console.error('Preview frame error:', error);
  }, []);

  // Update styles when variant changes
  useEffect(() => {
    if (!isLoading && selectedVariant) {
      injectStyles(selectedVariant.styles);
    }
  }, [selectedVariant, isLoading, injectStyles]);

  return {
    frameRef,
    isLoading,
    error,
    handleLoad,
    handleError
  };
};