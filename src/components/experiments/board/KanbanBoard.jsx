import React, { useState, useCallback, useMemo } from 'react';
import { useExperiments } from './hooks/useExperiments';
import BoardColumn from './components/BoardColumn';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const BOARD_STAGES = [
  { id: 'proposed', title: 'Proposed', description: 'New experiment ideas' },
  { id: 'approved', title: 'Approved', description: 'Ready for implementation' },
  { id: 'running', title: 'Running', description: 'Active experiments' },
  { id: 'finished', title: 'Finished', description: 'Completed experiments' }
];

const KanbanBoard = ({
  searchTerm = "",
  filterStatus = "all",
  refreshTrigger = 0,
  onExperimentClick,
  onExperimentDelete,
  onAddExperiment
}) => {
  // State
  const [isFinishedExpanded, setIsFinishedExpanded] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Fetch and manage experiments
  const {
    experiments,
    loading,
    error,
    refetch,
    updateExperimentStatus
  } = useExperiments(refreshTrigger);

  // Filter experiments
  const filteredExperiments = useMemo(() => {
    return experiments.filter(exp => {
      const matchesSearch = !searchTerm ||
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "all" || exp.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [experiments, searchTerm, filterStatus]);

  // Get experiments for a specific stage
  const getExperimentsForStage = useCallback((stage) => {
    return filteredExperiments.filter(exp => exp.stage === stage);
  }, [filteredExperiments]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e, experimentId) => {
    const experiment = experiments.find(exp => exp.id === experimentId);
    setDraggedItem(experiment);
    e.dataTransfer.setData('text/plain', experimentId);
    e.currentTarget.classList.add('opacity-50');
  }, [experiments]);

  const handleDragEnd = useCallback((e) => {
    e.preventDefault();
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
    
    const experimentId = e.dataTransfer.getData('text/plain');
    if (!experimentId) {
      console.error('No experiment ID found in drop event');
      return;
    }

    try {
      console.log(`Moving experiment ${experimentId} to stage ${targetStage}`);
      const success = await updateExperimentStatus(experimentId, targetStage);
      
      if (success) {
        console.log('Successfully moved experiment');
        await refetch(); // Refresh the board after successful move
      } else {
        console.error('Failed to update experiment status');
      }
    } catch (error) {
      console.error('Error moving experiment:', error);
    }
  }, [updateExperimentStatus, refetch]);

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Loading state
  if (loading && experiments.length === 0) {
    return (
      <div className="grid grid-cols-4 gap-6 w-full h-full">
        {BOARD_STAGES.slice(0, 3).map((stage) => (
          <div key={stage.id} className="h-full">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ))}
        <div className="w-16">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6 w-full min-h-[calc(100vh-12rem)]">
      {/* Regular Columns */}
      {BOARD_STAGES.slice(0, -1).map(stage => (
        <div key={stage.id} className="h-full w-full">
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
            onDelete={onExperimentDelete}
            onClick={onExperimentClick}
            onAddExperiment={() => onAddExperiment?.(stage.id)}
            className="h-full w-full"
          />
        </div>
      ))}

      {/* Finished Column */}
      <div
        className={`
          transition-all duration-300 ease-in-out relative w-full
          ${isFinishedExpanded ? '' : 'w-16'}
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
              onDelete={onExperimentDelete}
              onClick={onExperimentClick}
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
  );
};

export default KanbanBoard;