// src/services/analytics.service.js

import api from './api';

const getStats = async () => {
  try {
    const response = await api.get('/analytics/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stats:', error.response.data);
    throw error.response.data;
  }
};

const analyticsService = {
  getStats,
};

export default analyticsService;