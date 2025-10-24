// src/components/Layout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        {/* The page content (DashboardPage or UserManagementPage) 
            will be rendered here */}
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;