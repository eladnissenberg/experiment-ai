import React from 'react';
import { Filter, Search } from 'lucide-react';

const FilterBar = ({ activeFilter, onFilterChange, searchTerm, onSearchChange }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'conversion', label: 'Conversion' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'retention', label: 'Retention' },
    { id: 'personalization', label: 'Personalization' }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === filter.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          title="More filters"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;