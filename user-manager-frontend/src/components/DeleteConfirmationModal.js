// src/components/DeleteConfirmationModal.js

import React from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

const DeleteConfirmationModal = ({
  show,
  handleClose,
  handleConfirm,
  isLoading,
  error,
  username, // Pass the username to make the message specific
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>
          Are you sure you want to delete the user:{' '}
          <strong>{username}</strong>?
        </p>
        <p className="text-danger">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Deleting...</span>
            </>
          ) : (
            'Delete User'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;