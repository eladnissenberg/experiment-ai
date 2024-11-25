// api/db/seeds/activateExperiments.js

const ExperimentService = require('../../services/experimentService');

async function seedActiveExperiments() {
  try {
    console.log('Starting to seed active experiments...');

    // Update suggested-4 (Social Proof experiment)
    const socialProofExperiment = await ExperimentService.updateExperiment('suggested-4', {
      status: 'running',
      stage: 'running',
      traffic: "50% split", // Match the format of suggested experiments
      variants: [
        { id: 'control', name: 'Control' },
        { id: 'variant-a', name: 'Variant A' }
      ],
      results: {
        visitors: 1250,
        conversions: 175,
        variantVisitors: 625,
        variantConversions: 100,
        controlConversionRate: 12.0,
        variantConversionRate: 16.0,
        improvement: 33.3,
        confidence: 95 // Add explicit confidence value
      }
    });

    // Update suggested-5 (Header CTA experiment)
    const headerCtaExperiment = await ExperimentService.updateExperiment('suggested-5', {
      status: 'running',
      stage: 'running',
      traffic: "50% split", // Match the format of suggested experiments
      variants: [
        { id: 'control', name: 'Control' },
        { id: 'variant-a', name: 'Variant A' }
      ],
      results: {
        visitors: 2500,
        conversions: 225,
        variantVisitors: 1250,
        variantConversions: 125,
        controlConversionRate: 8.0,
        variantConversionRate: 10.0,
        improvement: 25.0,
        confidence: 92 // Add explicit confidence value
      }
    });

    console.log('✅ Active experiments seeded successfully:', {
      'suggested-4': {
        status: socialProofExperiment?.status,
        title: socialProofExperiment?.title,
        confidence: socialProofExperiment?.results?.confidence
      },
      'suggested-5': {
        status: headerCtaExperiment?.status,
        title: headerCtaExperiment?.title,
        confidence: headerCtaExperiment?.results?.confidence
      }
    });

    // Verify the updates
    const activeExperiments = await ExperimentService.getExperiments('running');
    console.log('\n📊 Current active experiments:', 
      activeExperiments.map(exp => ({
        id: exp.id,
        title: exp.title,
        status: exp.status,
        traffic: exp.traffic,
        confidence: exp.results.confidence + '%',
        variants: exp.variants?.length || 0
      }))
    );

  } catch (error) {
    console.error('❌ Error seeding active experiments:', error);
    throw error;
  }
}

// Execute if this file is run directly
if (require.main === module) {
  seedActiveExperiments()
    .then(() => {
      console.log('\n🎉 Seeding completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedActiveExperiments;