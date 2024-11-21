const ExperimentService = require('./experimentService');

class TrackingService {
  static async trackEvent(eventType, experimentId, timestamp, url) {
    try {
      const experiment = await ExperimentService.getExperiment(experimentId);
      if (!experiment) {
        throw new Error('Experiment not found');
      }

      switch (eventType) {
        case 'variant_view':
          experiment.results.variantVisitors++;
          break;
        case 'control_view':
          experiment.results.visitors++;
          break;
        case 'variant_conversion':
          experiment.results.variantConversions++;
          break;
        case 'control_conversion':
          experiment.results.conversions++;
          break;
      }

      this.updateStatistics(experiment);
      return true;
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }

  static updateStatistics(experiment) {
    const { visitors, conversions, variantVisitors, variantConversions } = experiment.results;

    experiment.results.controlConversionRate = visitors > 0
      ? (conversions / visitors) * 100
      : 0;

    experiment.results.variantConversionRate = variantVisitors > 0
      ? (variantConversions / variantVisitors) * 100
      : 0;

    experiment.results.improvement =
      experiment.results.variantConversionRate - experiment.results.controlConversionRate;
  }
}

module.exports = TrackingService;