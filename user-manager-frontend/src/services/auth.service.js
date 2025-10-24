// src/services/auth.service.js

import api from './api';

const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    // On successful login, return the data
    if (response.data.accessToken) {
      return response.data;
    }
  } catch (error) {
    // Handle and re-throw the error to be caught by the Redux thunk
    console.error('Login failed:', error.response.data);
    throw error.response.data;
  }
};

// We can add register, logout, etc. here later

const authService = {
  login,
};

export default authService;