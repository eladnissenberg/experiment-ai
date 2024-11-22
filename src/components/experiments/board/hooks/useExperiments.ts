import { useState, useEffect, useCallback } from 'react';
import { 
  EXPERIMENT_STATUSES,
  STAGE_TO_STATUS_MAP,
  BoardStage 
} from '../constants';
import { Experiment, ExperimentStatus } from '../types';

interface UseExperimentsReturn {
  experiments: Experiment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateExperimentStatus: (experimentId: string, stage: BoardStage) => Promise<boolean>;
}

declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
    };
  }
}

export const useExperiments = (refreshTrigger = 0): UseExperimentsReturn => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

  const fetchExperiments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/experiments`, {
        method: 'GET', // Explicitly state method
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5177'
        },
        credentials: 'include'
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
  }, [API_URL]);

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments, refreshTrigger]);

  const updateExperimentStatus = async (experimentId: string, stage: BoardStage): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      let status: ExperimentStatus = ((): ExperimentStatus => {
        switch (stage) {
          case 'proposed':
            return EXPERIMENT_STATUSES.PROPOSED;
          case 'approved':
            return EXPERIMENT_STATUSES.APPROVED;
          case 'running':
            return EXPERIMENT_STATUSES.RUNNING;
          case 'finished':
            return EXPERIMENT_STATUSES.COMPLETED;
          default:
            return EXPERIMENT_STATUSES.PROPOSED;
        }
      })();

      const response = await fetch(
        `${API_URL}/experiments/${experimentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status, stage })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update experiment: ${response.status}`);
      }

      setExperiments(prevExperiments =>
        prevExperiments.map(exp =>
          exp.id === experimentId
            ? { ...exp, status, stage }
            : exp
        )
      );

      await fetchExperiments();
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