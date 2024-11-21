// File: src/components/experiments/board/utils.ts

import { Experiment } from './types';
import { EXPERIMENT_STATUSES, PRIORITIES } from './constants';

export const formatExperimentData = (raw: any): Experiment => {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status || EXPERIMENT_STATUSES.DRAFT,
    stage: raw.stage || 'proposed',
    priority: raw.priority || PRIORITIES.MEDIUM,
    successProbability: raw.successProbability || 0,
    upliftPotential: raw.upliftPotential || '0%',
    timeToImplement: raw.timeToImplement || '1 day',
    variations: {
      control: { color: raw.variations?.control?.color || null },
      variant: { color: raw.variations?.variant?.color || '#4A90E2' }
    },
    targetURL: raw.targetURL || '',
    duration: {
      startDate: raw.duration?.startDate || new Date().toISOString(),
      endDate: raw.duration?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    confidence: raw.confidence || 0,
    traffic: raw.traffic || 50,
    metrics: {
      primary: raw.metrics?.primary || 'conversion',
      secondary: raw.metrics?.secondary || ['engagement']
    },
    audience: {
      targeting: raw.audience?.targeting || 'all',
      percentage: raw.audience?.percentage || 50
    },
    results: raw.results || {
      visitors: 0,
      conversions: 0,
      variantVisitors: 0,
      variantConversions: 0,
      controlConversionRate: 0,
      variantConversionRate: 0,
      improvement: 0
    },
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
};

export const calculateExperimentMetrics = (experiment: Experiment) => {
  const {
    results: {
      visitors = 0,
      conversions = 0,
      variantVisitors = 0,
      variantConversions = 0
    } = {}
  } = experiment;

  const controlRate = visitors > 0 ? (conversions / visitors) * 100 : 0;
  const variantRate = variantVisitors > 0 ? (variantConversions / variantVisitors) * 100 : 0;
  const improvement = controlRate > 0 ? ((variantRate - controlRate) / controlRate) * 100 : 0;

  return {
    controlRate: controlRate.toFixed(1),
    variantRate: variantRate.toFixed(1),
    improvement: improvement.toFixed(1),
    totalVisitors: visitors + variantVisitors,
    totalConversions: conversions + variantConversions
  };
};

export const validateExperiment = (experiment: Partial<Experiment>): boolean => {
  return !!(
    experiment.title?.trim() &&
    experiment.description?.trim() &&
    experiment.targetURL?.trim() &&
    experiment.variations?.variant?.color &&
    experiment.metrics?.primary
  );
};

export const generateExperimentId = (): string => {
  return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};