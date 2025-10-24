// src/services/user.service.js

import api from './api';

// params will be an object like { page, size, search }
const getAllUsers = async (params) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error.response.data);
    throw error.response.data;
  }
};

// --- NEW: Create a user ---
const createUser = async (userData) => {
  try {
    // userData will be { username, email, password, roleId, isActive }
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error.response.data);
    throw error.response.data;
  }
};

// --- NEW: Get a single user by ID ---
const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error.response.data);
    throw error.response.data;
  }
};

// --- NEW: Update a user ---
const updateUser = async (id, userData) => {
  try {
    // userData will be { username, email, roleId, isActive }
    // Note: We don't send the password here unless we're changing it
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error.response.data);
    throw error.response.data;
  }
};
// --- NEW: Delete a user ---
const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data; // Should just be a { message: '...' }
  } catch (error) {
    console.error('Failed to delete user:', error.response.data);
    throw error.response.data;
  }
};

const userService = {
  getAllUsers,
  createUser, // <-- ADD
  getUserById, // <-- ADD
  updateUser,
  deleteUser, // <-- ADD
};

export default userService;