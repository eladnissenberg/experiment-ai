import React, { useState, useCallback } from "react";
import { useExperiments } from "../board/hooks/useExperiments";
import ExperimentsHeader from "./ExperimentsHeader";
import KanbanBoard from "../board/KanbanBoard";
import NewExperimentModal from "../modals/NewExperimentModal";
import EditExperimentModal from "../modals/EditExperimentModal";  
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ExperimentManagement = () => {
  // State
  const [isNewExperimentModalOpen, setNewExperimentModalOpen] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState(null);
  const [deletingExperiment, setDeletingExperiment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    timeframe: "all",
    type: "all"
  });

  // API Handlers
  const handleExperimentCreated = useCallback(async (experimentData) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experimentData)
      });

      if (!response.ok) {
        throw new Error('Failed to create experiment');
      }

      setRefreshTrigger(prev => prev + 1);
      setNewExperimentModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create experiment: ' + err.message);
    }
  }, []);

  const handleExperimentUpdate = useCallback(async (updatedExperiment) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/experiments/${updatedExperiment.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedExperiment)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update experiment');
      }

      setRefreshTrigger(prev => prev + 1);
      setEditingExperiment(null);
      setError(null);
    } catch (err) {
      setError('Failed to update experiment: ' + err.message);
    }
  }, []);

  const handleExperimentDelete = useCallback(async (experimentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/experiments/${experimentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete experiment');
      }

      setRefreshTrigger(prev => prev + 1);
      setDeletingExperiment(null);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete experiment: ' + err.message);
      return false;
    }
  }, []);

  const handleStatusChange = useCallback(async (experimentId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/experiments/${experimentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update experiment status');
      }

      setRefreshTrigger(prev => prev + 1);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update experiment status: ' + err.message);
      return false;
    }
  }, []);

  // Event Handlers
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleExperimentClick = useCallback((experiment) => {
    setEditingExperiment(experiment);
  }, []);

  const handleNewExperiment = useCallback((stage = 'proposed') => {
    setNewExperimentModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Alert */}
      {error && (
        <div className="max-w-full mx-auto px-6 py-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-6 py-4">
          <ExperimentsHeader
            onNewExperiment={handleNewExperiment}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {/* Main Content - Adjusted padding and width */}
      <main className="px-6 py-6 w-full">
        <div className="w-full"> {/* Added wrapper div */}
          <KanbanBoard
            searchTerm={searchTerm}
            filterStatus={filters.status}
            refreshTrigger={refreshTrigger}
            onExperimentClick={handleExperimentClick}
            onExperimentDelete={(id) => setDeletingExperiment(id)}
            onExperimentStatusChange={handleStatusChange}
            onAddExperiment={handleNewExperiment}
          />
        </div>
      </main>

      {/* Modals */}
      {isNewExperimentModalOpen && (
        <NewExperimentModal
        isOpen={isNewExperimentModalOpen}
        onClose={() => setNewExperimentModalOpen(false)}
        onExperimentCreated={handleExperimentCreated}
      />
      )}

      {editingExperiment && (
        <EditExperimentModal
          isOpen={true}
          experiment={editingExperiment}
          onClose={() => setEditingExperiment(null)}
          onUpdate={handleExperimentUpdate}
        />
      )}

      {deletingExperiment && (
        <DeleteConfirmationModal
          isOpen={true}
          experiment={deletingExperiment}
          onClose={() => setDeletingExperiment(null)}
          onConfirm={() => handleExperimentDelete(deletingExperiment)}
        />
      )}
    </div>
  );
};

export default ExperimentManagement;