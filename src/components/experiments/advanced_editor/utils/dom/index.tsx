import { DOMElement, CSSProperties } from '../../types';

export const generateSelector = (element: DOMElement): string => {
  const parts: string[] = [];
  if (element.id) parts.push(`#${element.id}`);
  if (element.className.length) {
    parts.push(`.${element.className.join('.')}`);
  }
  if (!parts.length) {
    parts.push(element.tag);
  }
  return parts.join('');
};

export const findElement = (
  root: DOMElement,
  predicate: (element: DOMElement) => boolean
): DOMElement | null => {
  if (predicate(root)) return root;
  for (const child of root.children) {
    const found = findElement(child, predicate);
    if (found) return found;
  }
  return null;
};

export const generateUniqueElementId = (element: DOMElement, parentPath = ''): string => {
  const basePath = parentPath ? `${parentPath}>${element.tag}` : element.tag;
  const identifier = element.id || element.className.join('-') || crypto.randomUUID().slice(0, 8);
  return `${basePath}-${identifier}`;
};

export const updateElement = (
  root: DOMElement,
  elementId: string,
  updates: Partial<DOMElement>
): DOMElement => {
  if (root.id === elementId) {
    return { ...root, ...updates };
  }

  return {
    ...root,
    children: root.children.map(child => updateElement(child, elementId, updates))
  };
};

export const extractStyleProperties = (styles: CSSProperties): Record<string, string> => {
    const properties: Record<string, string> = {};
    Object.entries(styles).forEach(([key, value]) => {
      properties[key] = value.toString();
    });
    return properties;
  };
  
  export const applyStyles = (element: HTMLElement, styles: CSSProperties): void => {
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property as keyof CSSProperties] = value.toString();
    });
  };

export const diffStyles = (
  original: CSSProperties,
  modified: CSSProperties
): CSSProperties => {
  const diff: CSSProperties = {};
  Object.entries(modified).forEach(([key, value]) => {
    if (original[key] !== value) {
      diff[key] = value;
    }
  });
  return diff;
};

export const serializeDOM = (element: HTMLElement): DOMElement => {
  const computedStyle = window.getComputedStyle(element);
  
  return {
    id: element.id || crypto.randomUUID(),
    tag: element.tagName.toLowerCase(),
    className: Array.from(element.classList),
    attributes: Array.from(element.attributes)
      .reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}),
    styles: Array.from(computedStyle)
      .reduce((acc, prop) => ({ 
        ...acc, 
        [prop]: computedStyle.getPropertyValue(prop) 
      }), {}),
    children: Array.from(element.children).map(child => 
      serializeDOM(child as HTMLElement)
    ),
    parent: element.parentElement?.id || null,
    selectable: true,
    editable: true
  };
};

export const createElementFromDOM = (
  domElement: DOMElement,
  document: Document
): HTMLElement => {
  const element = document.createElement(domElement.tag);
  
  if (domElement.id) element.id = domElement.id;
  if (domElement.className.length) {
    element.className = domElement.className.join(' ');
  }
  
  Object.entries(domElement.attributes).forEach(([name, value]) => {
    if (name !== 'class' && name !== 'id') {
      element.setAttribute(name, value);
    }
  });
  
  applyStyles(element, domElement.styles);
  
  domElement.children.forEach(child => {
    element.appendChild(createElementFromDOM(child, document));
  });
  
  return element;
};