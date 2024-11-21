import { DOMElement, DOMExtractionResponse } from '../../types';

// Cache configuration
const CACHE_PREFIX = 'advanced_editor_';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour
const MAX_MEMORY_ENTRIES = 10;
const MAX_MEMORY_SIZE = 50 * 1024 * 1024; // 50MB total memory limit

// Type definitions
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  size: number;
}

interface DOMOptimizationOptions {
  maxDepth: number;
  maxChildrenPerNode: number;
  preserveAttributes: string[];
  preserveStyles: string[];
}

// Convert any style value to string
type StyleValue = string | number;
type StyleRecord = Record<string, StyleValue>;
type StringStyleRecord = Record<string, string>;

const convertStyleValues = (styles: StyleRecord): StringStyleRecord => {
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => [key, String(value)])
  );
};

// Cache and optimization utilities
class DOMOptimizer {
  private static readonly defaultOptions: DOMOptimizationOptions = {
    maxDepth: 25,
    maxChildrenPerNode: 50,
    preserveAttributes: ['id', 'class', 'src', 'href', 'alt', 'title', 'type'],
    preserveStyles: [
      'display', 'position', 'width', 'height', 'margin', 'padding',
      'color', 'background', 'font', 'text-align', 'border', 'flex'
    ]
  };

  static optimizeDOMExtraction(data: DOMExtractionResponse): DOMExtractionResponse {
    const optimizedStructure = this.optimizeDOMStructure(
      data.structure,
      this.defaultOptions,
      0
    );

    return {
      structure: optimizedStructure,
      styles: this.optimizeStyles(data.styles),
      assets: this.optimizeAssets(data.assets)
    };
  }

  private static optimizeDOMStructure(
    element: DOMElement,
    options: DOMOptimizationOptions,
    depth: number
  ): DOMElement {
    if (depth > options.maxDepth) return element;

    return {
      id: element.id,
      tag: element.tag,
      className: element.className,
      attributes: this.filterObjectByKeys(element.attributes, options.preserveAttributes),
      styles: this.filterObjectByKeys(convertStyleValues(element.styles), options.preserveStyles),
      children: element.children
        .slice(0, options.maxChildrenPerNode)
        .map(child => this.optimizeDOMStructure(child, options, depth + 1)),
      parent: element.parent,
      selectable: element.selectable,
      editable: element.editable
    };
  }

  private static filterObjectByKeys(
    obj: Record<string, string>,
    keysToPreserve: string[]
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) =>
        keysToPreserve.some(preserve => key.startsWith(preserve))
      )
    );
  }

  private static optimizeStyles(styles: Record<string, StyleRecord>): Record<string, StringStyleRecord> {
    return Object.fromEntries(
      Object.entries(styles)
        .filter(([selector]) => this.isImportantSelector(selector))
        .map(([selector, rules]) => [
          selector,
          convertStyleValues(this.filterObjectByKeys(convertStyleValues(rules), this.defaultOptions.preserveStyles))
        ])
    );
  }

  private static isImportantSelector(selector: string): boolean {
    const importantParts = ['#', '.', 'body', 'header', 'main', 'footer', 'div', 'span', 'button'];
    return importantParts.some(part => selector.includes(part));
  }

  private static optimizeAssets(assets: DOMExtractionResponse['assets']) {
    return {
      images: assets.images.slice(0, 100),
      fonts: assets.fonts.slice(0, 20),
      scripts: assets.scripts.slice(0, 50)
    };
  }
}

class CacheManager {
  private static instance: CacheManager;
  private memoryCache: Map<string, CacheEntry<unknown>>;
  private totalSize: number;

  private constructor() {
    this.memoryCache = new Map();
    this.totalSize = 0;
  }

  static getInstance(): CacheManager {
    if (!this.instance) {
      this.instance = new CacheManager();
    }
    return this.instance;
  }

  private calculateEntrySize(data: unknown): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 0;
    }
  }

  private evictIfNeeded(requiredSize: number) {
    if (this.totalSize + requiredSize <= MAX_MEMORY_SIZE) return;

    const entries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    while (this.totalSize + requiredSize > MAX_MEMORY_SIZE && entries.length > 0) {
      const [key, entry] = entries.shift()!;
      this.totalSize -= entry.size;
      this.memoryCache.delete(key);
    }
  }

  async set<T>(key: string, data: T): Promise<void> {
    try {
      const size = this.calculateEntrySize(data);
      
      // Remove old entry if exists
      const oldEntry = this.memoryCache.get(key);
      if (oldEntry) {
        this.totalSize -= oldEntry.size;
      }

      // Evict entries if needed
      this.evictIfNeeded(size);

      // Enforce maximum entries limit
      if (this.memoryCache.size >= MAX_MEMORY_ENTRIES) {
        const oldestKey = Array.from(this.memoryCache.entries())
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
        const oldestEntry = this.memoryCache.get(oldestKey)!;
        this.totalSize -= oldestEntry.size;
        this.memoryCache.delete(oldestKey);
      }

      // Add new entry
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        size
      };

      this.memoryCache.set(key, entry as CacheEntry<unknown>);
      this.totalSize += size;

    } catch (error) {
      console.warn('Cache write failed:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
      
      if (!entry) return null;

      if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
        this.totalSize -= entry.size;
        this.memoryCache.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Cache read failed:', error);
      return null;
    }
  }

  clear(): void {
    this.memoryCache.clear();
    this.totalSize = 0;
  }
}

// Export simplified interface functions
const cacheManager = CacheManager.getInstance();

export const getCachedDOMExtraction = (url: string): DOMExtractionResponse | null => {
  const result = cacheManager.get<DOMExtractionResponse>(`dom_${btoa(url)}`);
  return result;
};

export const cacheDOMExtraction = async (url: string, data: DOMExtractionResponse) => {
  const optimizedData = DOMOptimizer.optimizeDOMExtraction(data);
  await cacheManager.set(`dom_${btoa(url)}`, optimizedData);
};

export const getCachedElement = (elementId: string): DOMElement | null => {
  const result = cacheManager.get<DOMElement>(`element_${elementId}`);
  return result;
};

export const cacheElement = async (elementId: string, element: DOMElement) => {
  await cacheManager.set(`element_${elementId}`, element);
};

export const clearCache = () => {
  cacheManager.clear();
};