import React from 'react';
import { ElementEditorProps } from '../../types';
import { Palette, Type, Layout, Box } from 'lucide-react';
import { STYLE_CATEGORIES } from '../../constants';

type TabType = 'styles' | 'layout' | 'text';

const ElementEditor = ({
  element,
  variant,
  onUpdate
}: ElementEditorProps): JSX.Element => {
    const [activeTab, setActiveTab] = React.useState('styles' as TabType);

  const renderStyleEditor = () => (
    <div className="space-y-4">
      {Object.entries(STYLE_CATEGORIES).map(([category, properties]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {properties.map(property => {
              const currentValue = element.styles[property] || '';
              return (
                <div key={property} className="space-y-1">
                  <label className="text-xs text-gray-500">
                    {property.replace(/-/g, ' ')}
                  </label>
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => onUpdate(element.id, {
                      styles: { ...element.styles, [property]: e.target.value }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLayoutEditor = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Width</label>
          <input
            type="text"
            value={element.styles.width || ''}
            onChange={(e) => onUpdate(element.id, {
              styles: { ...element.styles, width: e.target.value }
            })}
            className="w-full px-2 py-1 text-sm border rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Height</label>
          <input
            type="text"
            value={element.styles.height || ''}
            onChange={(e) => onUpdate(element.id, {
              styles: { ...element.styles, height: e.target.value }
            })}
            className="w-full px-2 py-1 text-sm border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Margin</label>
        <div className="grid grid-cols-4 gap-2">
          {['top', 'right', 'bottom', 'left'].map(side => (
            <input
              key={side}
              type="text"
              value={element.styles[`margin-${side}`] || ''}
              onChange={(e) => onUpdate(element.id, {
                styles: { ...element.styles, [`margin-${side}`]: e.target.value }
              })}
              className="w-full px-2 py-1 text-sm border rounded"
              placeholder={side}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Padding</label>
        <div className="grid grid-cols-4 gap-2">
          {['top', 'right', 'bottom', 'left'].map(side => (
            <input
              key={side}
              type="text"
              value={element.styles[`padding-${side}`] || ''}
              onChange={(e) => onUpdate(element.id, {
                styles: { ...element.styles, [`padding-${side}`]: e.target.value }
              })}
              className="w-full px-2 py-1 text-sm border rounded"
              placeholder={side}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderTextEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text Content</label>
        <textarea
          value={element.attributes['textContent'] || ''}
          onChange={(e) => onUpdate(element.id, {
            attributes: { ...element.attributes, textContent: e.target.value }
          })}
          className="w-full px-2 py-1 text-sm border rounded h-20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Size</label>
          <input
            type="text"
            value={element.styles['font-size'] || ''}
            onChange={(e) => onUpdate(element.id, {
              styles: { ...element.styles, 'font-size': e.target.value }
            })}
            className="w-full px-2 py-1 text-sm border rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Weight</label>
          <select
            value={element.styles['font-weight'] || ''}
            onChange={(e) => onUpdate(element.id, {
              styles: { ...element.styles, 'font-weight': e.target.value }
            })}
            className="w-full px-2 py-1 text-sm border rounded"
          >
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white border rounded-lg flex flex-col">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium">Element Editor</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('styles')}
            className={`p-1.5 rounded ${
              activeTab === 'styles' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
            }`}
          >
            <Palette className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`p-1.5 rounded ${
              activeTab === 'layout' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
            }`}
          >
            <Layout className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`p-1.5 rounded ${
              activeTab === 'text' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
            }`}
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'styles' && renderStyleEditor()}
        {activeTab === 'layout' && renderLayoutEditor()}
        {activeTab === 'text' && renderTextEditor()}
      </div>
    </div>
  );
};

export default ElementEditor;