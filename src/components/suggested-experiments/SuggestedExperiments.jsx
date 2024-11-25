import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Search,
  RefreshCcw,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react';
import Modal from './components/Modal';
import ExperimentDetails from './components/ExperimentDetails';

const DeviceIcon = ({ device }) => {
  const iconProps = {
    className: "w-4 h-4",
    strokeWidth: 1.5
  };

  switch (device.toLowerCase()) {
    case 'desktop':
      return <Monitor {...iconProps} />;
    case 'mobile':
      return <Smartphone {...iconProps} />;
    case 'tablet':
      return <Tablet {...iconProps} />;
    case 'all devices':
    default:
      return <Layers {...iconProps} />;
  }
};

const SortableHeader = ({ label, sortKey, currentSort, onSort }) => {
  const isCurrentSort = currentSort.key === sortKey;
  const isAsc = currentSort.direction === 'asc';

  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center space-x-1 group"
    >
      <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
        {label}
      </span>
      <div className="flex flex-col">
        <ChevronUp 
          className={`w-3 h-3 ${isCurrentSort && isAsc ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-400'}`} 
        />
        <ChevronDown 
          className={`w-3 h-3 -mt-1 ${isCurrentSort && !isAsc ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-400'}`} 
        />
      </div>
    </button>
  );
};

const PriorityBadge = ({ priority }) => {
  const classes = {
    high: 'bg-red-50 text-red-700 border-red-100',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    low: 'bg-green-50 text-green-700 border-green-100'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes[priority]}`}>
      {priority}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
    {type}
  </span>
);

const SuccessProbabilityIndicator = ({ value }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-600 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-sm text-gray-600 min-w-[3rem]">
      {value}%
    </span>
  </div>
);

const Header = ({
  isGenerating,
  onGenerate,
  activeFilter,
  setActiveFilter,
  searchTerm,
  setSearchTerm
}) => (
  <div className="bg-white rounded-xl border border-gray-200 w-full">
    <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI-Powered Suggestions</h1>
            <p className="mt-1 text-sm text-gray-600">
              Intelligent experiment recommendations based on your data
            </p>
          </div>

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                <span>Generating Ideas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Generate New Ideas</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-6 py-3 flex items-center justify-between w-full">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search suggestions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 w-full border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'high', 'medium', 'low'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter === 'all' ? 'All' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Priority`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

const ExperimentsTable = ({ experiments, currentPage, itemsPerPage, onReview, onSort, currentSort }) => {
  const [showDurationTooltip, setShowDurationTooltip] = useState(false);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperiments = experiments.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left w-12">
                <span className="text-xs font-medium text-gray-500">#</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-medium text-gray-500">Experiment</span>
              </th>
              <th className="px-6 py-4 text-left">
                <SortableHeader
                  label="Priority"
                  sortKey="priority"
                  currentSort={currentSort}
                  onSort={onSort}
                />
              </th>
              <th className="px-6 py-4 text-left">
                <SortableHeader
                  label="Device"
                  sortKey="device"
                  currentSort={currentSort}
                  onSort={onSort}
                />
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center">
                  <SortableHeader
                    label="Duration"
                    sortKey="duration"
                    currentSort={currentSort}
                    onSort={onSort}
                  />
                  <div className="relative ml-1">
                    <Info 
                      className="w-3 h-3 text-gray-400 cursor-help"
                      onMouseEnter={() => setShowDurationTooltip(true)}
                      onMouseLeave={() => setShowDurationTooltip(false)}
                    />
                    {showDurationTooltip && (
                      <div className="absolute z-10 -top-2 left-6 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                        Duration in weeks
                      </div>
                    )}
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <SortableHeader
                  label="Success Prob."
                  sortKey="successProbability"
                  currentSort={currentSort}
                  onSort={onSort}
                />
              </th>
              <th className="px-6 py-4 text-left">
                <SortableHeader
                  label="Uplift"
                  sortKey="uplift"
                  currentSort={currentSort}
                  onSort={onSort}
                />
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-medium text-gray-500">Review</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentExperiments.map((experiment) => (
              <tr key={experiment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {experiment.id.split('-')[1]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <div className="font-medium text-sm text-gray-900">{experiment.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">{experiment.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <PriorityBadge priority={experiment.priority} />
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
                    <DeviceIcon device={experiment.device} />
                    <span className="sr-only">{experiment.device}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {experiment.timeToImplement.replace(/\s*weeks?/i, '')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <SuccessProbabilityIndicator value={experiment.successProbability} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{experiment.upliftPotential}</span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onReview(experiment)}
                    className="inline-flex items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition-colors border border-gray-200"
                    aria-label={`Review experiment ${experiment.id.split('-')[1]}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-gray-700">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} experiments
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === index + 1
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const SuggestedExperiments = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentSort, setCurrentSort] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 10;

  const fetchExperiments = async () => {
    try {
      const response = await fetch('/api/v1/experiments?status=proposed');
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setExperiments(data);
      setLoading(false);} catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchExperiments();
    }, []);
  
    useEffect(() => {
      setCurrentPage(1);
    }, [activeFilter, searchTerm]);
  
    const handleGenerateSuggestions = async () => {
      setIsGenerating(true);
      try {
        await fetchExperiments();
      } catch (error) {
        setError(error.message);
      } finally {
        setIsGenerating(false);
      }
    };
  
    const handleSort = (sortKey) => {
      setCurrentSort(prevSort => ({
        key: sortKey,
        direction: prevSort.key === sortKey && prevSort.direction === 'asc' ? 'desc' : 'asc'
      }));
    };
  
    const handleReviewExperiment = (experiment) => {
      setSelectedExperiment(experiment);
      setShowDialog(true);
    };
  
    const sortExperiments = (experiments) => {
      if (!currentSort.key) return experiments;
  
      return [...experiments].sort((a, b) => {
        let aValue, bValue;
  
        switch (currentSort.key) {
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority];
            bValue = priorityOrder[b.priority];
            break;
          case 'type':
            aValue = a.optimizationType;
            bValue = b.optimizationType;
            break;
          case 'device':
            aValue = a.device;
            bValue = b.device;
            break;
          case 'duration':
            aValue = parseInt(a.timeToImplement.match(/\d+/)[0]);
            bValue = parseInt(b.timeToImplement.match(/\d+/)[0]);
            break;
          case 'successProbability':
            aValue = a.successProbability;
            bValue = b.successProbability;
            break;
          case 'uplift':
            aValue = parseInt(a.upliftPotential.match(/\d+/)[0]);
            bValue = parseInt(b.upliftPotential.match(/\d+/)[0]);
            break;
          default:
            return 0;
        }
  
        if (currentSort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    };
  
    const filterExperiments = (experiments) => {
      return experiments.filter((exp) => {
        const matchesSearch = searchTerm.trim() === '' ||
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase());
  
        const matchesPriority = activeFilter === 'all' || exp.priority === activeFilter;
  
        return matchesSearch && matchesPriority;
      });
    };
  
    const filteredAndSortedExperiments = sortExperiments(filterExperiments(experiments));
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-6 space-y-4"> {/* Add common container with consistent padding */}
          <Header
            isGenerating={isGenerating}
            onGenerate={handleGenerateSuggestions}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
    
          <main>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCcw className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                {error}
              </div>
            ) : filteredAndSortedExperiments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
                <Sparkles className="w-6 h-6 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600">No suggestions match your filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                <ExperimentsTable
                  experiments={filteredAndSortedExperiments}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onReview={handleReviewExperiment}
                  onSort={handleSort}
                  currentSort={currentSort}
                />
    
                <Pagination
                  totalItems={filteredAndSortedExperiments.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
    
          {showDialog && selectedExperiment && (
            <Modal isOpen={showDialog} onClose={() => setShowDialog(false)}>
              <ExperimentDetails
                experiment={selectedExperiment}
                onClose={() => setShowDialog(false)}
              />
            </Modal>
          )}
        </div>
      </div>
    );
  };
  
  export default SuggestedExperiments;