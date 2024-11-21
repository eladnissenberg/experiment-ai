export const SELECTABLE_ELEMENTS = [
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'button', 'a', 'img', 'section', 'article', 'header', 'footer'
  ];
  
  export const EDITABLE_ATTRIBUTES = [
    'class', 'id', 'style', 'src', 'href', 'alt', 'title'
  ];
  
  export const STYLE_CATEGORIES = {
    LAYOUT: ['display', 'position', 'width', 'height', 'margin', 'padding'],
    TYPOGRAPHY: ['font-family', 'font-size', 'font-weight', 'color', 'text-align'],
    BACKGROUND: ['background-color', 'background-image', 'background-position'],
    BORDER: ['border-width', 'border-style', 'border-color', 'border-radius'],
    EFFECTS: ['opacity', 'box-shadow', 'transform']
  };
  
  export const DEFAULT_VARIANT = {
    id: 'control',
    name: 'Control',
    elements: [],
    traffic: 50,
    status: 'draft'
  } as const;
  
  export const CACHE_KEYS = {
    DOM_STRUCTURE: 'dom_structure',
    STYLES: 'styles',
    ASSETS: 'assets'
  } as const;
  
  export const ERROR_MESSAGES = {
    EXTRACTION_FAILED: 'Failed to extract DOM structure',
    INVALID_URL: 'Invalid target URL provided',
    VARIANT_ERROR: 'Error updating variant',
    PREVIEW_ERROR: 'Failed to load preview'
  } as const;
  
  export const PREVIEW_CONFIG = {
    IFRAME_TIMEOUT: 5000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  } as const;
  
  export const LOCAL_STORAGE_KEYS = {
    EDITOR_STATE: 'advanced_editor_state',
    RECENT_VARIANTS: 'recent_variants',
    DRAFT_EXPERIMENTS: 'draft_experiments'
  } as const;