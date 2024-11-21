// src/components/experiments/board/components/styled.jsx
import React from 'react';
import { ChevronRight, ChevronLeft, Plus, AlertCircle } from 'lucide-react';

export const ColumnContainer = ({ children, isDraggingOver, isCollapsed, className = '', ...props }) => (
  <div
    className={`
      flex flex-col
      bg-gray-50
      rounded-xl
      border border-gray-200
      shadow-sm
      transition-all duration-200
      ${isDraggingOver ? 'bg-blue-50/50 border-blue-200 shadow-md' : ''}
      ${isCollapsed ? 'w-16' : 'w-full'}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export const ColumnHeader = ({ title, description, count, onAddClick }) => (
  <div className="flex flex-col p-6 border-b border-gray-200">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {count > 0 && (
          <span className="px-2 py-0.5 text-sm bg-gray-100 text-gray-600 rounded-full">
            {count}
          </span>
        )}
      </div>
      <button
        onClick={onAddClick}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={`Add experiment to ${title}`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
    {description && (
      <p className="text-sm text-gray-500">{description}</p>
    )}
  </div>
);

export const ColumnContent = ({ children, className = '' }) => (
  <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${className}`}>
    {children}
  </div>
);

export const EmptyColumn = ({ message = "No experiments yet" }) => (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
      <AlertCircle className="w-6 h-6 text-gray-400" />
    </div>
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

export const ColumnToggleButton = ({ expanded, onClick, count = 0 }) => (
  <button
    onClick={onClick}
    className={`
      absolute top-1/2 -translate-y-1/2
      ${expanded ? '-left-3' : '-right-3'}
      bg-white rounded-full p-1.5
      shadow-md hover:bg-gray-50
      transition-colors
      z-10
    `}
    aria-label={expanded ? 'Collapse column' : 'Expand column'}
  >
    {expanded ? (
      <ChevronRight className="w-4 h-4 text-gray-500" />
    ) : (
      <ChevronLeft className="w-4 h-4 text-gray-500" />
    )}
  </button>
);

export const CollapsedColumn = ({ onClick, count = 0 }) => (
  <button
    onClick={onClick}
    className="h-full w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors group relative"
    aria-label="Show finished experiments"
  >
    <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
    <span className="writing-mode-vertical text-xs text-gray-500 mt-2 group-hover:text-gray-700">
      Finished
    </span>
    {count > 0 && (
      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
        <span className="text-xs text-white">{count}</span>
      </div>
    )}
  </button>
);

export const DragIndicator = ({ visible }) => (
  <div
    className={`
      absolute inset-0
      border-2 border-dashed border-blue-400
      rounded-xl
      bg-blue-50/20
      transition-opacity duration-200
      ${visible ? 'opacity-100' : 'opacity-0'}
    `}
  />
);

export const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="mt-2 text-sm text-gray-600">Loading experiments...</span>
    </div>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full p-6">
    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
      <AlertCircle className="w-6 h-6 text-red-600" />
    </div>
    <p className="text-sm text-red-600 text-center mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// CSS helper classes
export const TRANSITIONS = {
  DEFAULT: 'transition-all duration-200',
  SLOW: 'transition-all duration-300',
  FAST: 'transition-all duration-150'
};

export const SHADOWS = {
  DEFAULT: 'shadow-sm hover:shadow-md',
  ELEVATED: 'shadow-md hover:shadow-lg'
};