// File: src/components/experiments/board/constants.ts

export const EXPERIMENT_STATUSES = {
  DRAFT: 'draft',
  PROPOSED: 'proposed',
  APPROVED: 'approved',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const;

export const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

export const METRICS_TYPES = {
  CONVERSION: 'conversion',
  REVENUE: 'revenue',
  ENGAGEMENT: 'engagement',
  RETENTION: 'retention',
  BOUNCE_RATE: 'bounce_rate',
  PAGE_VIEWS: 'page_views',
  TIME_ON_SITE: 'time_on_site',
  CUSTOM: 'custom'
} as const;

// Export types derived from constants
export type ExperimentStatus = typeof EXPERIMENT_STATUSES[keyof typeof EXPERIMENT_STATUSES];
export type Priority = typeof PRIORITIES[keyof typeof PRIORITIES];
export type MetricType = typeof METRICS_TYPES[keyof typeof METRICS_TYPES];

// Export stage mapping type
export const STAGE_TO_STATUS_MAP = {
  proposed: EXPERIMENT_STATUSES.PROPOSED,
  approved: EXPERIMENT_STATUSES.APPROVED,
  running: EXPERIMENT_STATUSES.RUNNING,
  finished: EXPERIMENT_STATUSES.COMPLETED
} as const;

export type BoardStage = keyof typeof STAGE_TO_STATUS_MAP;