// hooks/useWindowSize.js
import { useState, useEffect } from 'react';
import { isBrowser } from '../utils/browserCheck';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: isBrowser() ? window.innerWidth : 1200,
    height: isBrowser() ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (!isBrowser()) return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};