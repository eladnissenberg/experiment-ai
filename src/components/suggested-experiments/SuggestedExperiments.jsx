import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  RefreshCcw,
  BarChart2,
  Target,
  ChevronLeft,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import ExperimentDetails from './components/ExperimentDetails';
import Modal from './components/Modal';

const Header = ({
  isGenerating,
  onGenerate,
  activeFilter,
  setActiveFilter,
  searchTerm,
  setSearchTerm
}) => (
  <div className="bg-white border-b py-4">
    <div className="max-w-[1440px] mx-auto px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">AI-Powered Suggestions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Intelligent experiment recommendations based on your data
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium shadow-sm"
        >
          {isGenerating ? (
            <>
              <RefreshCcw className="w-4 h-4 animate-spin mr-1.5" />
              <span>Generating Ideas...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Generate New Ideas</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search suggestions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 w-full border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'high', 'medium', 'low'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
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
  </div>
);

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm text-gray-700">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} experiments
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ExperimentsTable = ({ experiments, currentPage, itemsPerPage, onReview }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperiments = experiments.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Experiment</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Priority</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Device</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Success Prob.</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Uplift</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentExperiments.map((experiment) => (
            <tr key={experiment.id} className="border-b last:border-0">
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-sm text-gray-900">{experiment.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{experiment.description}</div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  experiment.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : experiment.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {experiment.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                  {experiment.optimizationType}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
                  {experiment.device}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{experiment.successProbability}%</td>
              <td className="px-4 py-3 text-sm text-gray-900">{experiment.upliftPotential}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onReview(experiment)}
                  className="inline-flex items-center px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const itemsPerPage = 10;

  const fetchExperiments = async () => {
    try {
      const response = await fetch('/api/v1/experiments?status=proposed');
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setExperiments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

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

  const handleStartExperiment = async (experiment) => {
    try {
      const response = await fetch(`/api/v1/experiments/${experiment.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'running' }),
      });

      if (!response.ok) throw new Error('Failed to start experiment');

      await fetchExperiments();
      setShowDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReviewExperiment = (experiment) => {
    setSelectedExperiment(experiment);
    setShowDialog(true);
  };

  const filteredExperiments = experiments.filter((exp) => {
    if (searchTerm) {
      return exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (activeFilter !== 'all') {
      return exp.priority === activeFilter;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isGenerating={isGenerating}
        onGenerate={handleGenerateSuggestions}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="max-w-[1440px] mx-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCcw className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            {error}
          </div>
        ) : filteredExperiments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
            <Sparkles className="w-6 h-6 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">No suggestions match your filters</p>
          </div>
        ) : (
          <>
            <Pagination
              totalItems={filteredExperiments.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <ExperimentsTable
              experiments={filteredExperiments}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onReview={handleReviewExperiment}
            />
          </>
        )}
      </main>

      <Modal isOpen={showDialog} onClose={() => setShowDialog(false)}>
        {selectedExperiment && (
          <ExperimentDetails
            experiment={selectedExperiment}
            onStartExperiment={handleStartExperiment}
          />
        )}
      </Modal>
    </div>
  );
};

export default SuggestedExperiments;