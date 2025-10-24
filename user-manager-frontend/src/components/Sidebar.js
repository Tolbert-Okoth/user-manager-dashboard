// src/components/Sidebar.js

import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

// Import some icons (optional, but nice)
// You might need to install: npm install react-bootstrap-icons
// For now, we'll use text.

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div
      className="d-flex flex-column vh-100 p-3 bg-dark text-white"
      style={{ width: '250px' }}
    >
      <h4 className="mb-4">Admin Panel</h4>

      <Nav variant="pills" className="flex-column mb-auto">
        <Nav.Item className="mb-2">
          {/* NavLink will automatically get the 'active' class */}
          <Nav.Link as={NavLink} to="/" end>
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="mb-2">
          <Nav.Link as={NavLink} to="/users">
            User Management
          </Nav.Link>
        </Nav.Item>
        {/* Add more links here as you build */}
      </Nav>

      <hr />
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;