// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import analyticsReducer from './analyticsSlice'; // <-- 1. IMPORT

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    analytics: analyticsReducer, // <-- 2. ADD
  },
});

export default store;