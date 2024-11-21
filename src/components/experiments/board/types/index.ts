// src/components/experiments/board/types/index.ts

export interface Experiment {
  id: string;
  title: string;
  description: string;
  status: ExperimentStatus;
  stage: BoardStage;
  priority: ExperimentPriority;
  successProbability: number;
  upliftPotential: string;
  timeToImplement: string;
  variations: {
    control: { color: string | null };
    variant: { color: string };
  };
  targetURL: string;
  duration: {
    startDate: string;
    endDate: string;
  };
  confidence?: number;
  traffic?: number;
  metrics: {
    primary: string;
    secondary: string[];
  };
  audience: {
    targeting: string;
    percentage: number;
  };
  results?: {
    visitors: number;
    conversions: number;
    conversionRate: number;
    variantVisitors: number;
    variantConversions: number;
    controlConversionRate?: number;
    variantConversionRate?: number;
    improvement?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type ExperimentStatus = 
  | 'draft'
  | 'proposed'
  | 'approved'
  | 'running'
  | 'paused'
  | 'finished'
  | 'archived';

export type ExperimentPriority = 'low' | 'medium' | 'high';

export const BOARD_STAGES = [
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
  },
  {
    id: 'finished',
    title: 'Finished',
    description: 'Completed experiments'
  }
] as const;

export type BoardStage = typeof BOARD_STAGES[number]['id'];

// Board component props
export interface BoardColumnProps {
  title: string;
  description?: string;
  experiments: Experiment[];
  stage: BoardStage;
  isDraggingOver?: boolean;
  isLoading?: boolean;
  className?: string;
  onDragStart?: (e: React.DragEvent, experimentId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent, stage: BoardStage) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, stage: BoardStage) => void;
  onDelete?: (experimentId: string) => void;
  onClick?: (experiment: Experiment) => void;
  onAddExperiment?: (stage: BoardStage) => void;
}

export interface ExperimentCardProps {
  experiment: Experiment;
  stage?: BoardStage;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onStatusChange?: (status: ExperimentStatus) => Promise<void>;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
}

export interface KanbanBoardProps {
  searchTerm?: string;
  filterStatus?: string;
  refreshTrigger?: number;
  onExperimentClick?: (experiment: Experiment) => void;
  onExperimentDelete?: (experimentId: string) => Promise<boolean>;
  onExperimentStatusChange?: (experimentId: string, newStatus: ExperimentStatus) => Promise<boolean>;
}

// API response types
export interface APIResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    perPage: number;
  };
}

export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}

// Validation utils
export const isValidExperiment = (experiment: unknown): experiment is Experiment => {
  if (!experiment || typeof experiment !== 'object') return false;
  
  const e = experiment as Experiment;
  return (
    typeof e.id === 'string' &&
    typeof e.title === 'string' &&
    typeof e.description === 'string' &&
    typeof e.status === 'string' &&
    typeof e.stage === 'string'
  );
};

export const hasRequiredExperimentFields = (experiment: Partial<Experiment>): boolean => {
  return !!(
    experiment.title &&
    experiment.description &&
    experiment.targetURL &&
    experiment.variations?.variant?.color &&
    experiment.duration?.startDate &&
    experiment.duration?.endDate &&
    experiment.metrics?.primary
  );
};

export const experimentValidationRules = {
  required: ['title', 'description', 'status', 'stage'],
  minLength: {
    title: 3,
    description: 10
  }
};