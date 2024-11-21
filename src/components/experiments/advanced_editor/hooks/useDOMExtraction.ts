import { useState, useCallback } from 'react';
import { DOMExtractionResponse } from '../types';
import { getCachedDOMExtraction, cacheDOMExtraction } from '../utils/cache';

export const useDOMExtraction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);
  const [data, setData] = useState(null as DOMExtractionResponse | null);

  const extractDOM = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const cached = getCachedDOMExtraction(url);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/v1/extraction/extract?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to extract DOM structure');
      }

      const extractionData: DOMExtractionResponse = await response.json();
      cacheDOMExtraction(url, extractionData);
      setData(extractionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract DOM');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    extractDOM,
    loading,
    error,
    data
  };
};