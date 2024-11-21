// File: src/components/experiments/board/hooks/useExperimentMetrics.ts

import { useMemo } from 'react';
import { Experiment } from '../types';

interface ExperimentMetrics {
  conversionRate: number;
  uplift: number;
  confidence: number;
  significance: boolean;
  sampleSize: number;
  power: number;
}

export const useExperimentMetrics = (experiment: Experiment): ExperimentMetrics => {
  return useMemo(() => {
    const {
      results = {
        visitors: 0,
        conversions: 0,
        variantVisitors: 0,
        variantConversions: 0
      }
    } = experiment;

    // Calculate control conversion rate
    const controlConversionRate = results.visitors > 0
      ? (results.conversions / results.visitors) * 100
      : 0;

    // Calculate variant conversion rate
    const variantConversionRate = results.variantVisitors > 0
      ? (results.variantConversions / results.variantVisitors) * 100
      : 0;

    // Calculate uplift
    const uplift = controlConversionRate > 0
      ? ((variantConversionRate - controlConversionRate) / controlConversionRate) * 100
      : 0;

    // Calculate statistical significance
    const standardError = Math.sqrt(
      (controlConversionRate * (100 - controlConversionRate)) / results.visitors +
      (variantConversionRate * (100 - variantConversionRate)) / results.variantVisitors
    );

    const zScore = Math.abs(variantConversionRate - controlConversionRate) / standardError;
    const confidence = (1 - 0.5 * Math.erfc(zScore / Math.sqrt(2))) * 100;

    // Calculate required sample size for 95% confidence, 80% power
    const minimumDetectableEffect = 0.05; // 5% minimum detectable effect
    const alpha = 0.05; // 95% confidence level
    const beta = 0.2; // 80% power
    const p = controlConversionRate / 100;
    const za = 1.96; // z-score for 95% confidence
    const zb = 0.84; // z-score for 80% power

    const requiredSampleSize = Math.ceil(
      ((za * Math.sqrt(2 * p * (1 - p)) + zb * Math.sqrt(p * (1 - p) + (p + minimumDetectableEffect) * (1 - p - minimumDetectableEffect))) ** 2) /
      (minimumDetectableEffect ** 2)
    );

    const currentSampleSize = results.visitors + results.variantVisitors;
    const power = currentSampleSize / requiredSampleSize * 100;

    return {
      conversionRate: variantConversionRate,
      uplift,
      confidence,
      significance: confidence >= 95,
      sampleSize: currentSampleSize,
      power: Math.min(power, 100)
    };
  }, [experiment]);
};

export default useExperimentMetrics;