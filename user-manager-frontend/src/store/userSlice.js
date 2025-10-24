// src/store/userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/user.service'; // <-- MAKE SURE THIS IS IMPORTED

const initialState = {
  users: [],
  pagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  },
  isLoading: false,
  error: null,
  // --- NEW ---
  // status will help us know when a C/U/D operation is done
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

// Async thunk to fetch users (Unchanged)
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  // ... (code for fetchUsers is unchanged)
  async (params, { rejectWithValue }) => {
    try {
      const data = await userService.getAllUsers(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- NEW: Async thunk to create a user ---
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await userService.createUser(userData);
      return data;
    } catch (error) {
      // 'error' here is the object we threw from user.service.js
      return rejectWithValue(error.message);
    }
  }
);

// --- NEW: Async thunk to update a user ---
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const data = await userService.updateUser(id, userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- NEW: Async thunk to delete a user ---
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id; // Return the ID of the deleted user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // --- NEW: Reducer to reset the status ---
    // We'll call this after a C/U/D action is successful
    // to reset the status back to 'idle'
    resetUserStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination.totalItems = action.payload.totalItems;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- NEW: Create User Cases ---
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Store the error message
      })

      // --- NEW: Update User Cases ---
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- NEW: Delete User Cases ---
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = 'succeeded';
        // We don't need to manually remove the user from the state
        // because our page will re-fetch the list on success.
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// --- NEW: Export the new action ---
export const { resetUserStatus } = userSlice.actions;

export default userSlice.reducer;