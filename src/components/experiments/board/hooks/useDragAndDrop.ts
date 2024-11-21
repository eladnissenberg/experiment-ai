// File: src/components/experiments/board/hooks/useDragAndDrop.ts

import { useState, useCallback } from 'react';
import { Experiment, BoardStage } from '../types';

interface UseDragAndDropReturn {
  draggedExperiment: Experiment | null;
  isDraggingOver: BoardStage | null;
  handleDragStart: (e: React.DragEvent, experiment: Experiment) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent, stage: BoardStage) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, stage: BoardStage) => Promise<void>;
}

export const useDragAndDrop = (
  onExperimentMove: (experimentId: string, targetStage: BoardStage) => Promise<boolean>
): UseDragAndDropReturn => {
  const [draggedExperiment, setDraggedExperiment] = useState<Experiment | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<BoardStage | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, experiment: Experiment) => {
    setDraggedExperiment(experiment);
    e.dataTransfer.setData('experimentId', experiment.id);
    e.currentTarget.classList.add('opacity-50');
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedExperiment(null);
    setIsDraggingOver(null);
    e.currentTarget.classList.remove('opacity-50');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, stage: BoardStage) => {
    e.preventDefault();
    if (isDraggingOver !== stage) {
      setIsDraggingOver(stage);
    }
  }, [isDraggingOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, stage: BoardStage) => {
    e.preventDefault();
    setIsDraggingOver(null);

    const experimentId = e.dataTransfer.getData('experimentId');
    if (!experimentId) return;

    try {
      await onExperimentMove(experimentId, stage);
    } catch (error) {
      console.error('Error moving experiment:', error);
    }
  }, [onExperimentMove]);

  return {
    draggedExperiment,
    isDraggingOver,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

export default useDragAndDrop;