import React from 'react';
import { Clock, TrendingUp, Target } from 'lucide-react';

const ExperimentMetrics = ({ success, uplift, time }) => {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      <span className="inline-flex items-center">
        Success: <span className="font-semibold ml-1">{success}%</span>
      </span>
      <span className="inline-flex items-center">
        Uplift: <span className="font-semibold ml-1">{uplift}</span>
      </span>
      <span className="inline-flex items-center">
        Time: <span className="font-semibold ml-1">{time}</span>
      </span>
    </div>
  );
};

export default ExperimentMetrics;