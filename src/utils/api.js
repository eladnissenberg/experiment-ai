import apiConfig from './apiConfig';

/**
 * Handles API response and error parsing
 * @param {Response} response - Fetch API response object
 * @returns {Promise} Parsed response data
 * @throws {Error} Enhanced error with status and message
 */
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Response handling error:', error);
    throw new Error(error.message || 'Failed to process response');
  }
};

/**
 * Main API service object containing all API interaction methods
 */
export const apiService = {
  /**
   * Check API health status
   */
  async checkHealth() {
    try {
      console.log('Health check URL:', `${apiConfig.baseURL}/health`);
      
      const response = await fetch(`${apiConfig.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Health Check Error:', error);
      throw new Error('API health check failed');
    }
  },

  /**
   * Get experiments with optional status filter
   * @param {string} status - Optional status filter
   */
  async getExperiments(status) {
    try {
      const url = new URL(`${apiConfig.baseURL}/api/v1/experiments`);
      if (status) {
        url.searchParams.append('status', status);
      }

      console.log('Fetching experiments:', url.toString());

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Get Experiments Error:', error);
      throw new Error('Failed to fetch experiments');
    }
  },

  /**
   * Get a single experiment by ID
   * @param {string} id - Experiment ID
   */
  async getExperiment(id) {
    try {
      const response = await fetch(`${apiConfig.baseURL}/api/v1/experiments/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Get Experiment Error:', error);
      throw new Error('Failed to fetch experiment');
    }
  },

  /**
   * Create a new experiment
   * @param {Object} data - Experiment data
   */
  async createExperiment(data) {
    try {
      const response = await fetch(`${apiConfig.baseURL}/api/v1/experiments`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Create Experiment Error:', error);
      throw new Error('Failed to create experiment');
    }
  },

  /**
   * Update an existing experiment
   * @param {string} id - Experiment ID
   * @param {Object} data - Updated experiment data
   */
  async updateExperiment(id, data) {
    try {
      const response = await fetch(`${apiConfig.baseURL}/api/v1/experiments/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Update Experiment Error:', error);
      throw new Error('Failed to update experiment');
    }
  },

  /**
   * Delete an experiment
   * @param {string} id - Experiment ID
   */
  async deleteExperiment(id) {
    try {
      const response = await fetch(`${apiConfig.baseURL}/api/v1/experiments/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // For DELETE requests, we might get 204 No Content
      if (response.status === 204) {
        return true;
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Delete Experiment Error:', error);
      throw new Error('Failed to delete experiment');
    }
  },

  /**
   * Track an event
   * @param {Object} eventData - Event data to track
   */
  async trackEvent(eventData) {
    try {
      const response = await fetch(`${apiConfig.baseURL}/api/v1/tracking/event`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Track Event Error:', error);
      throw new Error('Failed to track event');
    }
  }
};

export default apiService;