import React from 'react';
import {
  Plus,
  Search,
  Filter,
  X,
  RefreshCcw,
} from 'lucide-react';

const ExperimentsHeader = ({
  onNewExperiment,
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onRefresh
}) => {
  return (
    <div className="bg-white border-b">
      <div className="px-6 py-4">
        {/* Title and Actions Row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Experiments</h1>
            <p className="text-sm text-gray-500">Manage and monitor your experiments</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onNewExperiment}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Experiment
            </button>
            
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Refresh experiments"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Search and Filters Row */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search experiments..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-3 py-2 w-full border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="pl-3 pr-8 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Experiments</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="pl-3 pr-8 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            title="More filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentsHeader;