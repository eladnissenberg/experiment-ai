// Create a new file: src/components/experiments/advanced_editor/utils/browser.ts
export const isBrowser = () => typeof window !== 'undefined';

export const isValidVariant = (variant: any) => {
  return variant && 
         typeof variant === 'object' && 
         typeof variant.id === 'string' &&
         Array.isArray(variant.elements);
};