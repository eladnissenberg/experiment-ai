// src/utils/apiConfig.js

const apiConfig = {
    // Base URLs - remove /api/v1 from here as it's included in endpoints
    baseURL: import.meta.env.VITE_API_URL.replace('/api/v1', ''),
    
    // Endpoints - include /api/v1 in the endpoints
    endpoints: {
      experiments: '/api/v1/experiments',
      tracking: '/api/v1/tracking',
      health: '/api/v1/health', // This matches your API route
    },
    
    // Request configurations
    timeouts: {
      default: 5000,
      long: 10000,
    },
    
    // Default headers
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  
    // Status codes
    statusCodes: {
      success: 200,
      created: 201,
      noContent: 204,
      badRequest: 400,
      unauthorized: 401,
      notFound: 404,
      serverError: 500,
    }
  };
  
  export const getApiUrl = (endpoint) => `${apiConfig.baseURL}${apiConfig.endpoints[endpoint]}`;
  
  export const getHeaders = (additionalHeaders = {}) => ({
    ...apiConfig.headers,
    ...additionalHeaders,
  });
  
  export default apiConfig;