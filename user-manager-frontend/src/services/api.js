// src/services/api.js

import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  This function will be used later.
  When the user logs in, we'll get a token.
  We'll call this function to add that token to the headers
  of all future requests.
*/
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-access-token'] = token;
  } else {
    delete api.defaults.headers.common['x-access-token'];
  }
};

export default api;