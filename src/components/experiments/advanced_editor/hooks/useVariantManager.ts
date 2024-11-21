import { useState, useCallback } from 'react';
import { Variant, CSSProperties } from '../types';
import { createVariant, updateVariantElement, removeVariantElement, calculateTrafficSplit } from '../utils/variants';

export const useVariantManager = (initialVariants: Variant[] = []) => {
    const [variants, setVariants] = useState(initialVariants);
    const [activeVariant, setActiveVariant] = useState(null as Variant | null);

  const addVariant = useCallback((name: string) => {
    const newVariant = createVariant(name);
    setVariants(current => [...current, newVariant]);
    return newVariant;
  }, []);

  const updateVariant = useCallback((variantId: string, updates: Partial<Variant>) => {
    setVariants(current => 
      current.map(variant =>
        variant.id === variantId ? { ...variant, ...updates } : variant
      )
    );
  }, []);

  const deleteVariant = useCallback((variantId: string) => {
    setVariants(current => {
      const filtered = current.filter(v => v.id !== variantId);
      return calculateTrafficSplit(filtered);
    });
    if (activeVariant?.id === variantId) {
      setActiveVariant(null);
    }
  }, [activeVariant]);

  const updateElementStyles = useCallback((elementId: string, styles: CSSProperties) => {
    if (!activeVariant) return;
    
    const updatedVariant = updateVariantElement(activeVariant, elementId, styles);
    setActiveVariant(updatedVariant);
    setVariants(current =>
      current.map(v => v.id === updatedVariant.id ? updatedVariant : v)
    );
  }, [activeVariant]);

  return {
    variants,
    activeVariant,
    setActiveVariant,
    addVariant,
    updateVariant,
    deleteVariant,
    updateElementStyles
  };
};