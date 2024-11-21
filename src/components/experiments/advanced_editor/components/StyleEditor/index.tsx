import React from 'react';
import { StyleEditorProps } from '../../types';
import { STYLE_CATEGORIES } from '../../constants';
import { Palette, Eye, EyeOff, Undo } from 'lucide-react';

const StyleEditor = ({ element, onStyleChange }: StyleEditorProps): JSX.Element => {
  const [originalStyles] = React.useState(element.styles);
  const [showPreview, setShowPreview] = React.useState(true);

  const handleStyleChange = (property: string, value: string | number) => {
    onStyleChange({
      ...element.styles,
      [property]: typeof value === 'number' ? value.toString() : value,
    });
  };

  const resetStyles = () => {
    onStyleChange(originalStyles);
  };

  const formatPropertyLabel = (property: string): string => {
    return property
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStyleValue = (value: string | number): string => {
    return value?.toString() || '';
  };

  return (
    <div className="h-full bg-white border rounded-lg flex flex-col">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium">Style Editor</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={resetStyles}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
            title="Reset Styles"
          >
            <Undo className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {showPreview && (
            <div className="mb-6 border rounded-lg p-4">
              <h4 className="text-xs text-gray-500 mb-2">Live Preview</h4>
              <div style={element.styles}>
                {element.tag === 'img' ? (
                  <img
                    src={element.attributes.src || '/placeholder.png'}
                    alt={element.attributes.alt || 'Preview'}
                    className="max-w-full"
                  />
                ) : (
                  <div className="p-4 border rounded">Sample Text Content</div>
                )}
              </div>
            </div>
          )}

          {Object.entries(STYLE_CATEGORIES).map(([category, properties]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-medium flex items-center">
                <Palette className="w-4 h-4 mr-1 text-gray-400" />
                {category}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {properties.map(property => {
                  const value = element.styles[property] || '';

                  return (
                    <div key={property} className="space-y-1">
                      <label className="block text-xs text-gray-500">
                        {formatPropertyLabel(property)}
                      </label>
                      {property.includes('color') ? (
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={getStyleValue(value)}
                            onChange={e => handleStyleChange(property, e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={getStyleValue(value)}
                            onChange={e => handleStyleChange(property, e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border rounded"
                          />
                        </div>
                      ) : property.includes('size') ||
                        property.includes('width') ||
                        property.includes('height') ||
                        property.includes('margin') ||
                        property.includes('padding') ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={parseFloat(getStyleValue(value)) || ''}
                            onChange={e => {
                              const val = e.target.value;
                              handleStyleChange(property, val ? `${val}px` : '');
                            }}
                            className="w-20 px-2 py-1 text-sm border rounded"
                          />
                          <select
                            value={getStyleValue(value).replace(/[\d.]/g, '') || 'px'}
                            onChange={e => {
                              const num = parseFloat(getStyleValue(value)) || 0;
                              handleStyleChange(property, `${num}${e.target.value}`);
                            }}
                            className="text-sm border rounded"
                          >
                            <option value="px">px</option>
                            <option value="%">%</option>
                            <option value="rem">rem</option>
                            <option value="em">em</option>
                          </select>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={getStyleValue(value)}
                          onChange={e => handleStyleChange(property, e.target.value)}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
