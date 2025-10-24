// src/components/UserFormModal.js

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';

const UserFormModal = ({
  show,
  handleClose,
  handleSubmit,
  userToEdit,
  isLoading,
  error,
}) => {
  // Determine if we are in "edit" mode
  const isEditMode = !!userToEdit;

  // --- Form State ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Only for create mode
  const [roleId, setRoleId] = useState(2); // Default to 'user'
  const [isActive, setIsActive] = useState(true);

  // --- Populate form when in edit mode ---
  useEffect(() => {
    if (isEditMode) {
      setUsername(userToEdit.username);
      setEmail(userToEdit.email);
      setRoleId(userToEdit.Role.id);
      setIsActive(userToEdit.isActive);
      setPassword(''); // Clear password field in edit mode
    } else {
      // Reset form for "create" mode
      setUsername('');
      setEmail('');
      setPassword('');
      setRoleId(2);
      setIsActive(true);
    }
  }, [userToEdit, isEditMode, show]); // Re-run when modal is shown

  // --- Form submission handler ---
  const onInternalSubmit = (e) => {
    e.preventDefault();
    const formData = {
      username,
      email,
      roleId: Number(roleId), // Ensure roleId is a number
      isActive,
    };

    if (isEditMode) {
      // Pass the ID and data for an update
      handleSubmit(userToEdit.id, formData);
    } else {
      // Add password only for new user
      formData.password = password;
      handleSubmit(formData); // Pass data for creation
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? 'Edit User' : 'Create New User'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onInternalSubmit}>
        <Modal.Body>
          {/* Show API errors (like 'username already exists') */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Only show Password field in CREATE mode */}
          {!isEditMode && (
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>User</option>
                  {/* Add more roles if you have them */}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Check
                  type="switch"
                  label={isActive ? 'Active' : 'Inactive'}
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : isEditMode ? (
              'Save Changes'
            ) : (
              'Create User'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserFormModal;