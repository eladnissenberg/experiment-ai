// server/controllers/experimentController.js

const ExperimentService = require('../services/experimentService');

exports.getExperiments = async (req, res, next) => {
  try {
    console.log('Fetching experiments...'); // Debug log
    const { status } = req.query;
    const experiments = await ExperimentService.getExperiments(status);
    console.log('Experiments fetched:', experiments); // Debug log
    res.json(experiments);
  } catch (error) {
    console.error('Error in getExperiments:', error); // Error log
    next(error);
  }
};

exports.createExperiment = async (req, res, next) => {
  try {
    console.log('Creating experiment with data:', req.body); // Debug log
    const experiment = await ExperimentService.createExperiment(req.body);
    res.status(201).json(experiment);
  } catch (error) {
    console.error('Error in createExperiment:', error); // Error log
    next(error);
  }
};

exports.getExperiment = async (req, res, next) => {
  try {
    const experiment = await ExperimentService.getExperiment(req.params.id);
    if (!experiment) {
      return res.status(404).json({ error: 'Experiment not found' });
    }
    res.json(experiment);
  } catch (error) {
    console.error('Error in getExperiment:', error); // Error log
    next(error);
  }
};

exports.updateExperimentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const experiment = await ExperimentService.updateExperimentStatus(req.params.id, status);
    if (!experiment) {
      return res.status(404).json({ error: 'Experiment not found' });
    }
    res.json(experiment);
  } catch (error) {
    console.error('Error in updateExperimentStatus:', error); // Error log
    next(error);
  }
};