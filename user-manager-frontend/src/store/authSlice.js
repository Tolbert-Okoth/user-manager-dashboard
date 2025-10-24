// src/store/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/auth.service';
import { setAuthToken } from '../services/api';

// Try to get user data from localStorage if it exists
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isAuthenticated: token ? true : false,
  isLoading: false,
  error: null,
};

// --- Async Thunk for Login ---
// This handles the async API call
export const loginUser = createAsyncThunk(
  'auth/loginUser', // Action type prefix
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // 1. Make the API call
      const data = await authService.login(email, password);

      // 2. Store token and user in localStorage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data));

      // 3. Set the auth token for all future API requests
      setAuthToken(data.accessToken);

      // 4. Return the user data to be stored in the state
      return data;
    } catch (error) {
      // 'error' here is the object we threw from auth.service.js
      return rejectWithValue(error.message);
    }
  }
);

// --- The Slice Definition ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  // 'Reducers' are for synchronous actions
  reducers: {
    logout: (state) => {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Clear the auth header
      setAuthToken(null);

      // Reset the state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  // 'extraReducers' are for async actions (like our thunk)
  extraReducers: (builder) => {
    builder
      // When login is pending (API call is running)
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // When login is successful
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // The data we returned
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      // When login fails
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // The error message from rejectWithValue
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// Export the synchronous 'logout' action
export const { logout } = authSlice.actions;

// Export the reducer to be added to the store
export default authSlice.reducer;