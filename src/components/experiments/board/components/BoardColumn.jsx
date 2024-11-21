import React from 'react';
import { Plus, Info, AlertCircle } from 'lucide-react';
import ExperimentCard from '../../cards/ExperimentCard';

const BoardColumn = ({
  title,
  description,
  experiments = [],
  stage,
  isDraggingOver,
  isLoading,
  className = '',
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onDelete,
  onClick,
  onAddExperiment
}) => {
  // Event handlers for drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver?.(e, stage);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const experimentId = e.dataTransfer.getData('text/plain');
    if (experimentId) {
      onDrop?.(e, stage);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only trigger if we're actually leaving the column (not entering a child)
    if (e.currentTarget === e.target) {
      onDragLeave?.(e);
    }
  };

  // Get stage-specific empty state message
  const getEmptyMessage = () => {
    switch (stage) {
      case 'proposed':
        return "No proposed experiments yet";
      case 'approved':
        return "No experiments awaiting implementation";
      case 'running':
        return "No active experiments";
      case 'finished':
        return "No completed experiments";
      default:
        return "No experiments in this column";
    }
  };

  return (
    <div
      className={`
        h-full w-full flex flex-col
        bg-white rounded-xl
        border border-gray-200
        shadow-sm
        transition-all duration-200
        ${isDraggingOver ? 'ring-2 ring-blue-100 bg-blue-50/30' : ''}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      data-stage={stage}
      role="region"
      aria-label={`${title} experiments`}
    >
      {/* Column Header */}
      <div className="flex flex-col border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-medium text-gray-900">{title}</h3>
              {experiments.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  {experiments.length}
                </span>
              )}
            </div>
            {onAddExperiment && (
              <button
                onClick={() => onAddExperiment(stage)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={`Add experiment to ${title}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {description && (
            <div className="flex items-center space-x-1.5">
              <Info className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Column Content */}
      <div 
        className="flex-1 overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="p-4 space-y-3">
          {experiments.length === 0 ? (
            <div 
              className={`
                flex flex-col items-center justify-center h-32 
                border-2 border-dashed 
                ${isDraggingOver ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-gray-50/50'} 
                rounded-lg transition-colors duration-200
              `}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mb-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 text-center">{getEmptyMessage()}</p>
              {onAddExperiment && (
                <button
                  onClick={() => onAddExperiment(stage)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add experiment
                </button>
              )}
            </div>
          ) : (
            experiments.map((experiment) => (
              <ExperimentCard
                key={experiment.id}
                experiment={experiment}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDelete={() => onDelete?.(experiment.id)}
                onClick={() => onClick?.(experiment)}
                className="transition-all duration-200"
              />
            ))
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="mt-2 text-sm text-gray-600">Loading experiments...</span>
          </div>
        </div>
      )}
      
      {/* Drag Indicator */}
      {isDraggingOver && (
        <div 
          className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50/20 pointer-events-none animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default BoardColumn;