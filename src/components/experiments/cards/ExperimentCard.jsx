import React from 'react';
import { Users, Clock } from 'lucide-react';

const ExperimentCard = ({
  experiment,
  onDragStart,
  onDragEnd,
  onDelete,
  onClick,
  className = ''
}) => {
  const {
    id,
    title,
    description,
    status,
    priority,
    confidence,
    traffic,
  } = experiment;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-700';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700';
      case 'low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    onDragStart(e, id);
    // Add a custom drag ghost image or style
    e.currentTarget.classList.add('opacity-50');
    // Set dragged data
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    e.currentTarget.classList.remove('opacity-50');
    onDragEnd(e);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(experiment);
  };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`
        group
        bg-white
        rounded-lg
        border border-gray-200
        p-3
        cursor-grab
        active:cursor-grabbing
        hover:shadow-sm
        hover:border-blue-200
        transition-all duration-200
        ${className}
      `}
      role="button"
      aria-label={`Experiment: ${title}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="text-sm font-medium text-gray-900 leading-tight">{title}</h4>
          <div className="flex items-center gap-2 mt-1">
            {status && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {status}
              </span>
            )}
            {priority && (
              <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(priority)}`}>
                {priority}
              </span>
            )}
          </div>
        </div>
      </div>

      {description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {confidence && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {confidence}%
            </div>
          )}
          {traffic && (
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {traffic}%
            </div>
          )}
        </div>
      </div>

      {/* Optional: Add drag handle indicator */}
      <div className="absolute top-2 right-2 w-1.5 h-6 flex flex-col justify-between opacity-0 group-hover:opacity-30">
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
      </div>
    </div>
  );
};

export default ExperimentCard;