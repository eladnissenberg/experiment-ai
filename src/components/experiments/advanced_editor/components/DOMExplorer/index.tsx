import React from 'react';
import { DOMElement } from '../../types';
import { ChevronRight, ChevronDown, Edit, Eye } from 'lucide-react';
import { generateUniqueElementId } from '../../utils/dom';

interface DOMExplorerProps {
  structure: DOMElement;
  selectedElementId?: string;
  onElementSelect: (elementId: string) => void;
  onElementHover: (elementId: string | null) => void;
}

const DOMExplorer = ({
  structure,
  selectedElementId,
  onElementSelect,
  onElementHover
}: DOMExplorerProps) => {
  const [expandedNodes, setExpandedNodes] = React.useState(() => new Set<string>());

  const toggleNode = (id: string) => {
    setExpandedNodes(current => {
      const newSet = new Set(current);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderElement = (element: DOMElement, depth: number = 0, parentPath = '') => {
    const elementPath = generateUniqueElementId(element, parentPath);
    const isExpanded = expandedNodes.has(elementPath);
    const isSelected = element.id === selectedElementId;

    return (
      <div key={elementPath} className="select-none">
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${
            isSelected ? 'bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${depth * 20}px` }}
          onClick={() => onElementSelect(element.id)}
          onMouseEnter={() => onElementHover(element.id)}
          onMouseLeave={() => onElementHover(null)}
        >
          {element.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(elementPath);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}

          <div className="flex items-center space-x-2 ml-1">
            <span className="text-purple-600 font-mono text-sm">{element.tag}</span>
            {element.id && (
              <span className="text-gray-500 text-xs">#{element.id}</span>
            )}
            {element.className.length > 0 && (
              <span className="text-blue-500 text-xs">
                .{element.className.join('.')}
              </span>
            )}
          </div>

          <div className="ml-auto flex items-center space-x-1">
            {element.editable && <Edit className="w-4 h-4 text-gray-400" />}
            {element.selectable && <Eye className="w-4 h-4 text-gray-400" />}
          </div>
        </div>

        {isExpanded && element.children.length > 0 && (
          <div>
            {element.children.map(child =>
              renderElement(child, depth + 1, elementPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto bg-white border rounded-lg">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium">DOM Explorer</h3>
      </div>
      <div className="p-2">{renderElement(structure)}</div>
    </div>
  );
};

export default DOMExplorer;