import { useState, useEffect, useCallback } from 'react';
import { 
  EXPERIMENT_STATUSES,
  STAGE_TO_STATUS_MAP,
  BoardStage 
} from '../constants';
import { Experiment } from '../types';

interface UseExperimentsReturn {
  experiments: Experiment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateExperimentStatus: (experimentId: string, stage: BoardStage) => Promise<boolean>;
}

export const useExperiments = (refreshTrigger = 0): UseExperimentsReturn => {
  const [experiments, setExperiments] = useState([] as Experiment[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);

  const fetchExperiments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3000/api/v1/experiments', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch experiments: ${response.status}`);
      }

      const data = await response.json();
      setExperiments(data);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching experiments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments, refreshTrigger]);

  const updateExperimentStatus = async (experimentId: string, stage: BoardStage): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Map stage to status according to your server's expectations
      let status: string;
      switch (stage) {
        case 'proposed':
          status = 'proposed';
          break;
        case 'approved':
          status = 'approved';
          break;
        case 'running':
          status = 'active'; // Note: server expects 'active' for running state
          break;
        case 'finished':
          status = 'completed';
          break;
        default:
          status = 'proposed';
      }

      const response = await fetch(
        `http://localhost:3000/api/v1/experiments/${experimentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            status,
            stage 
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update experiment: ${response.status}`);
      }

      // Optimistically update local state
      setExperiments(prevExperiments =>
        prevExperiments.map(exp =>
          exp.id === experimentId
            ? { ...exp, status, stage }
            : exp
        )
      );

      await fetchExperiments(); // Refresh to ensure consistency
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred';
      console.error('Error updating experiment status:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    experiments,
    loading,
    error,
    refetch: fetchExperiments,
    updateExperimentStatus
  };
};

export default useExperiments;