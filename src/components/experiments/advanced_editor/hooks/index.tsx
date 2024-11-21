export * from './useDOMExtraction';
export * from './useElementSelection';
export * from './useVariantManager';

// Custom hook composition for advanced editor
import { useDOMExtraction } from './useDOMExtraction';
import { useElementSelection } from './useElementSelection';
import { useVariantManager } from './useVariantManager';
import { DOMElement, Variant } from '../types';

export const useAdvancedEditor = (targetURL: string) => {
  const { extractDOM, loading, error, data } = useDOMExtraction();
  const { selectedElement, hoveredElement, selectElement, setHoveredElement, updateSelectedElement } = 
    useElementSelection(data?.structure || null);
  const { variants, activeVariant, setActiveVariant, addVariant, updateVariant, deleteVariant, updateElementStyles } = 
    useVariantManager();

  const updateElement = (elementId: string, updates: Partial<DOMElement>) => {
    const updatedRoot = updateSelectedElement(updates);
    if (updatedRoot && activeVariant) {
      updateElementStyles(elementId, updates.styles || {});
    }
    return updatedRoot;
  };

  return {
    loading,
    error,
    data,
    extractDOM,
    selectedElement,
    hoveredElement,
    selectElement,
    setHoveredElement,
    updateElement,
    variants,
    activeVariant,
    setActiveVariant,
    addVariant,
    updateVariant,
    deleteVariant
  };
};