// src/components/PrivateRoute.js

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If authenticated, render the child route.
  // <Outlet /> is a placeholder for the nested route component (e.g., DashboardPage)
  // If not authenticated, redirect to the login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;