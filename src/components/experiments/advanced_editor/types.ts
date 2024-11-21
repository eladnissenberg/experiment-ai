export interface DOMElement {
    id: string;
    tag: string;
    className: string[];
    attributes: Record<string, string>;
    styles: CSSProperties;
    children: DOMElement[];
    parent: string | null;
    selectable: boolean;
    editable: boolean;
  }
  
  export interface CSSProperties {
    [key: string]: string | number;
  }
  
  export interface ElementSelection {
    id: string;
    selector: string;
    originalStyles: CSSProperties;
    variantStyles: CSSProperties;
  }
  
  export interface Variant {
    id: string;
    name: string;
    elements: ElementSelection[];
    traffic: number;
    status: 'draft' | 'active' | 'paused' | 'completed';
    views?: number;
    conversions?: number;
    conversionRate?: string;
  }
  
  export interface ExperimentConfig {
    id: string;
    name: string;
    targetURL: string;
    variants: Variant[];
    schedule: {
      startDate: string;
      endDate: string;
    };
    status: 'draft' | 'active' | 'paused' | 'completed';
  }
  
  export interface DOMExtractionResponse {
    structure: DOMElement;
    styles: Record<string, CSSProperties>;
    assets: {
      images: string[];
      fonts: string[];
      scripts: string[];
    };
  }
  
  export interface StyleEditorProps {
    element: DOMElement;
    onStyleChange: (styles: CSSProperties) => void;
  }
  
  export interface PreviewFrameProps {
    variant: Variant;
    targetURL: string;
    onError?: (error: string) => void;
  }
  
  export interface ElementEditorProps {
    element: DOMElement;
    variant: Variant;
    onUpdate: (elementId: string, updates: Partial<DOMElement>) => void;
  }
  
  export interface VariantManagerProps {
    experiment: ExperimentConfig;
    onVariantUpdate: (variantId: string, updates: Partial<Variant>) => void;
    onVariantCreate: () => void;
    onVariantDelete: (variantId: string) => void;
  }