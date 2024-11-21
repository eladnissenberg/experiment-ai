import { Variant, ElementSelection, CSSProperties } from '../../types';

export const createVariant = (name: string, traffic: number = 50): Variant => ({
  id: crypto.randomUUID(),
  name,
  elements: [],
  traffic,
  status: 'draft'
});

export const updateVariantElement = (
  variant: Variant,
  elementId: string,
  styles: CSSProperties
): Variant => {
  const existingElement = variant.elements.find(el => el.id === elementId);
  
  if (existingElement) {
    return {
      ...variant,
      elements: variant.elements.map(el =>
        el.id === elementId
          ? { ...el, variantStyles: { ...el.variantStyles, ...styles } }
          : el
      )
    };
  }

  return {
    ...variant,
    elements: [
      ...variant.elements,
      {
        id: elementId,
        originalStyles: {},
        variantStyles: styles
      }
    ]
  };
};

export const removeVariantElement = (
  variant: Variant,
  elementId: string
): Variant => ({
  ...variant,
  elements: variant.elements.filter(el => el.id !== elementId)
});

export const calculateTrafficSplit = (variants: Variant[]): Variant[] => {
  const totalTraffic = variants.reduce((sum, v) => sum + v.traffic, 0);
  if (totalTraffic === 0) return variants;

  return variants.map(variant => ({
    ...variant,
    traffic: Math.round((variant.traffic / totalTraffic) * 100)
  }));
};

export const validateVariant = (variant: Variant): string[] => {
  const errors: string[] = [];
  
  if (!variant.name?.trim()) {
    errors.push('Variant name is required');
  }
  
  if (variant.traffic < 0 || variant.traffic > 100) {
    errors.push('Traffic allocation must be between 0 and 100');
  }
  
  if (!variant.elements.length) {
    errors.push('Variant must have at least one modified element');
  }

  return errors;
};

export const generateVariantStyles = (element: ElementSelection): string => {
  return Object.entries(element.variantStyles)
    .map(([prop, value]) => `${prop}: ${value};`)
    .join(' ');
};

export const mergeVariants = (variants: Variant[]): Variant => {
  const mergedElements = variants.flatMap(v => v.elements)
    .reduce((acc, element) => {
      const existing = acc.find(e => e.id === element.id);
      if (!existing) return [...acc, element];
      
      return acc.map(e => e.id === element.id ? {
        ...e,
        variantStyles: { ...e.variantStyles, ...element.variantStyles }
      } : e);
    }, [] as ElementSelection[]);

  return {
    id: crypto.randomUUID(),
    name: 'Merged Variant',
    elements: mergedElements,
    traffic: 100,
    status: 'draft'
  };
};

export const exportVariant = (variant: Variant): string => {
  return JSON.stringify({
    name: variant.name,
    elements: variant.elements.map(el => ({
      selector: `[data-variant-id="${el.id}"]`,
      styles: el.variantStyles
    }))
  }, null, 2);
};