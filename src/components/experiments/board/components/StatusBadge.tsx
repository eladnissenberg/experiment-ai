// File: src/components/experiments/board/components/StatusBadge.tsx

import React from 'react';
import { CheckCircle, PlayCircle, PauseCircle, Clock, Archive, AlertCircle } from 'lucide-react';
import { ExperimentStatus } from '../types';
import { EXPERIMENT_STATUSES } from '../constants';

interface StatusBadgeProps {
  status: ExperimentStatus;
  className?: string;
}

const STATUS_CONFIG = {
  [EXPERIMENT_STATUSES.DRAFT]: {
    icon: Clock,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700'
  },
  [EXPERIMENT_STATUSES.PROPOSED]: {
    icon: AlertCircle,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  [EXPERIMENT_STATUSES.APPROVED]: {
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  [EXPERIMENT_STATUSES.RUNNING]: {
    icon: PlayCircle,
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700'
  },
  [EXPERIMENT_STATUSES.PAUSED]: {
    icon: PauseCircle,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  },
  [EXPERIMENT_STATUSES.COMPLETED]: {
    icon: CheckCircle,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  },
  [EXPERIMENT_STATUSES.ARCHIVED]: {
    icon: Archive,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700'
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${config.bgColor} ${config.textColor}
        ${className}
      `}
    >
      <Icon className="w-3.5 h-3.5 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;