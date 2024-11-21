import React from 'react';
import { ArrowDownUp } from 'lucide-react';

const SortOptions = ({ value, onChange }) => {
  const options = [
    { value: 'priority', label: 'Highest Impact' },
    { value: 'probability', label: 'Success Probability' },
    { value: 'ease', label: 'Easiest to Implement' },
    { value: 'recent', label: 'Most Recent' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <ArrowDownUp className="w-4 h-4 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-3 pr-10 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions;