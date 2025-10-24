// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout'; // <-- 1. IMPORT

import { setAuthToken } from './services/api';
import store from './store';
import './App.css';

// ... (token setup code remains the same) ...

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* --- UPDATED: Private Routes ---
          We now wrap our pages inside the Layout component.
          PrivateRoute protects the Layout, and the Layout
          provides the persistent sidebar.
        */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}> {/* <-- 2. WRAP */}
            {/* These are the "children" rendered by <Outlet /> */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UserManagementPage />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;