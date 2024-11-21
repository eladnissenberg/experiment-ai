import React, { useState, useCallback } from 'react';
import { useExperiments } from './hooks/useExperiments';
import BoardColumn from './components/BoardColumn';
import EditExperimentModal from '../modals/EditExperimentModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Plus,
  Search,
  RefreshCw
} from 'lucide-react';

const BOARD_STAGES = [
  {
    id: 'proposed',
    title: 'Proposed',
    description: 'New experiment ideas'
  },
  {
    id: 'approved',
    title: 'Approved',
    description: 'Ready for implementation'
  },
  {
    id: 'running',
    title: 'Running',
    description: 'Active experiments'
  }
];

const ExperimentBoard = ({
  searchTerm = "",
  filterStatus = "all",
  filterPriority = "all",
  refreshTrigger = 0,
  onExperimentClick,
  onExperimentDelete,
  onExperimentStatusChange,
  onNewExperiment,
  onSearch,
  onFilterChange
}) => {
  // State
  const [isFinishedExpanded, setIsFinishedExpanded] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [editingExperiment, setEditingExperiment] = useState(null);
  const [deletingExperiment, setDeletingExperiment] = useState(null);

  // Data and loading states
  const {
    experiments,
    loading,
    error,
    refetch,
    updateExperimentStatus
  } = useExperiments(refreshTrigger);

  // Filter experiments based on search and filters
  const filteredExperiments = useCallback(() => {
    return experiments.filter(exp => {
      const searchMatch = !searchTerm ||
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = filterStatus === "all" || exp.status === filterStatus;
      const priorityMatch = filterPriority === "all" || exp.priority === filterPriority;

      return searchMatch && statusMatch && priorityMatch;
    });
  }, [experiments, searchTerm, filterStatus, filterPriority]);

  // Get experiments for a specific stage
  const getExperimentsForStage = useCallback((stage) => {
    return filteredExperiments().filter(exp => exp.stage === stage);
  }, [filteredExperiments]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e, experimentId) => {
    const experiment = experiments.find(exp => exp.id === experimentId);
    setDraggedItem(experiment);
    e.dataTransfer.setData('experimentId', experimentId);
    e.currentTarget.classList.add('opacity-50');
  }, [experiments]);

  const handleDragEnd = useCallback((e) => {
    setDraggedItem(null);
    setDragOverColumn(null);
    e.currentTarget.classList.remove('opacity-50');
  }, []);

  const handleDragOver = useCallback((e, columnId) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  }, [dragOverColumn]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (e, targetStage) => {
    e.preventDefault();
    setDragOverColumn(null);

    const experimentId = e.dataTransfer.getData('experimentId');
    if (!experimentId || !draggedItem) return;

    try {
      await updateExperimentStatus(experimentId, targetStage);
      await refetch();
    } catch (error) {
      console.error('Error moving experiment:', error);
    }
  }, [draggedItem, updateExperimentStatus, refetch]);

  // Handle experiment actions
  const handleExperimentEdit = async (updatedExperiment) => {
    try {
      await updateExperimentStatus(updatedExperiment.id, updatedExperiment.status);
      await refetch();
      setEditingExperiment(null);
    } catch (error) {
      console.error('Error updating experiment:', error);
    }
  };

  const handleExperimentDelete = async (experimentId) => {
    try {
      await onExperimentDelete(experimentId);
      await refetch();
      setDeletingExperiment(null);
    } catch (error) {
      console.error('Error deleting experiment:', error);
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Main scrollable container */}
      <div className="h-full overflow-x-auto">
        {/* Use full width container that matches header */}
        <div className="min-h-full py-6 px-6 w-full">
          {/* Board Section */}
          <div className="flex gap-6 w-full">
            {/* Regular Columns */}
            {BOARD_STAGES.map(stage => (
              <div key={stage.id} className="flex-1 min-w-[320px]">
                <BoardColumn
                  title={stage.title}
                  description={stage.description}
                  experiments={getExperimentsForStage(stage.id)}
                  stage={stage.id}
                  isDraggingOver={dragOverColumn === stage.id}
                  isLoading={loading}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDelete={(id) => setDeletingExperiment(experiments.find(e => e.id === id))}
                  onClick={(experiment) => setEditingExperiment(experiment)}
                  onAddExperiment={() => onNewExperiment(stage.id)}
                  className="h-full"
                />
              </div>
            ))}

            {/* Finished Column */}
            <div
              className={`
                transition-all duration-300 ease-in-out relative
                ${isFinishedExpanded ? 'min-w-[320px]' : 'w-16'}
              `}
            >
              {isFinishedExpanded ? (
                <>
                  <button
                    onClick={() => setIsFinishedExpanded(false)}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 z-10"
                    title="Collapse finished column"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                  <BoardColumn
                    title="Finished"
                    description="Completed experiments"
                    experiments={getExperimentsForStage('finished')}
                    stage="finished"
                    isDraggingOver={dragOverColumn === 'finished'}
                    isLoading={loading}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onDelete={(id) => setDeletingExperiment(experiments.find(e => e.id === id))}
                    onClick={(experiment) => setEditingExperiment(experiment)}
                    className="h-full"
                  />
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsFinishedExpanded(true)}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 z-10"
                    title="Expand finished column"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  <div
                    className="h-full bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setIsFinishedExpanded(true)}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-2">
                      <span className="text-sm font-medium text-gray-900 rotate-90 whitespace-nowrap">
                        Finished ({getExperimentsForStage('finished').length})
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="mt-2 text-sm text-gray-600">Loading experiments...</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {editingExperiment && (
        <EditExperimentModal
          isOpen={true}
          experiment={editingExperiment}
          onClose={() => setEditingExperiment(null)}
          onUpdate={handleExperimentEdit}
        />
      )}

      {deletingExperiment && (
        <DeleteConfirmationModal
          isOpen={true}
          experiment={deletingExperiment}
          onClose={() => setDeletingExperiment(null)}
          onConfirm={() => handleExperimentDelete(deletingExperiment.id)}
        />
      )}
    </div>
  );
};

export default ExperimentBoard;