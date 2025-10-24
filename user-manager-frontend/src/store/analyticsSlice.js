// src/store/analyticsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../services/analytics.service';

const initialState = {
  stats: null,
  isLoading: false,
  error: null,
};

export const fetchStats = createAsyncThunk(
  'analytics/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;