import { useState, useCallback } from 'react';
import { DOMElement } from '../types';
import { findElement, updateElement } from '../utils/dom';

export const useElementSelection = (rootElement: DOMElement | null) => {
    const [selectedElement, setSelectedElement] = useState(null as DOMElement | null);
    const [hoveredElement, setHoveredElement] = useState(null as DOMElement | null);

  const selectElement = useCallback((elementId: string) => {
    if (!rootElement) return;
    const element = findElement(rootElement, el => el.id === elementId);
    setSelectedElement(element);
  }, [rootElement]);

  const updateSelectedElement = useCallback((updates: Partial<DOMElement>) => {
    if (!selectedElement || !rootElement) return null;
    
    const updatedRoot = updateElement(rootElement, selectedElement.id, updates);
    const updatedElement = findElement(updatedRoot, el => el.id === selectedElement.id);
    setSelectedElement(updatedElement);
    return updatedRoot;
  }, [selectedElement, rootElement]);

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
    setHoveredElement(null);
  }, []);

  return {
    selectedElement,
    hoveredElement,
    selectElement,
    setHoveredElement,
    updateSelectedElement,
    clearSelection
  };
};