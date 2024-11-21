import React from 'react';
import { RefreshCw, Zap } from 'lucide-react';

const TestControls = ({ onGenerateVariant }) => {
  const predefinedColors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#22C55E' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' }
  ];

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Quick Test</h3>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Reset Editor"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {predefinedColors.map(color => (
          <button
            key={color.value}
            onClick={() => onGenerateVariant(color.value)}
            className="w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-white flex items-center space-x-2"
          >
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: color.value }}
            />
            <span>{color.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onGenerateVariant(generateRandomColor())}
        className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center space-x-2"
      >
        <Zap className="w-4 h-4" />
        <span>Generate Random Color</span>
      </button>
    </div>
  );
};

export default TestControls;