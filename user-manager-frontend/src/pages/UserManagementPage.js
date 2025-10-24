// src/pages/UserManagementPage.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserStatus,
} from '../store/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

import UserFormModal from '../components/UserFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

import {
  Container,
  Table,
  Pagination,
  Spinner,
  Alert,
  Button,
  Badge,
  Form,
  Row,
  Col,
  InputGroup,
} from 'react-bootstrap';

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const {
    users,
    pagination,
    isLoading,
    status: userStatus,
    error: userError,
  } = useSelector((state) => state.users);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ASC' });

  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // --- Delete Modal State ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Store the whole user object

  // --- useEffect to fetch users (Unchanged) ---
  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        size: usersPerPage,
        search: submittedSearch,
        sort: sortConfig.key,
        order: sortConfig.direction,
      })
    );
  }, [dispatch, currentPage, submittedSearch, sortConfig]);

  // --- UPDATED: Effect to handle successful C/U/D operations ---
  useEffect(() => {
    if (userStatus === 'succeeded') {
      handleCloseModal(); // Close create/edit modal
      handleCloseDeleteModal(); // Close delete modal
      dispatch(resetUserStatus()); // Reset status
      // Re-fetch users
      dispatch(
        fetchUsers({
          page: currentPage,
          size: usersPerPage,
          search: submittedSearch,
          sort: sortConfig.key,
          order: sortConfig.direction,
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, dispatch, currentPage, submittedSearch, sortConfig]);

  // --- Create/Edit Modal Handlers (Unchanged) ---
  const handleCloseModal = () => {
    setShowModal(false);
    setUserToEdit(null);
    dispatch(resetUserStatus());
  };

  const handleShowCreateModal = () => {
    setUserToEdit(null);
    setShowModal(true);
  };

  const handleShowEditModal = (user) => {
    setUserToEdit(user);
    setShowModal(true);
  };

  // --- Form Submit Handler (Unchanged) ---
  const handleFormSubmit = async (idOrData, data) => {
    let action;
    if (userToEdit) {
      action = updateUser({ id: userToEdit.id, userData: idOrData });
    } else {
      action = createUser(idOrData);
    }
    try {
      const result = await dispatch(action);
      unwrapResult(result);
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  // --- NEW: Delete Modal Handlers ---
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
    if (userStatus !== 'loading') {
      dispatch(resetUserStatus()); // Clear any errors
    }
  };

  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const result = await dispatch(deleteUser(userToDelete.id));
      unwrapResult(result);
      // On success, the useEffect for 'userStatus' will fire
      // and close the modal + re-fetch.
    } catch (err) {
      console.error('Failed to delete user:', err);
      // Error is now in state (userError) and will be shown in the modal.
    }
  };

  // --- Search & Sort Handlers (Unchanged) ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSubmittedSearch(searchTerm);
  };
  const handleClearSearch = () => {
    setSearchTerm('');
    setSubmittedSearch('');
    setCurrentPage(1);
  };
  const handleSort = (key) => {
    let direction = 'ASC';
    if (sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DESC';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ASC' ? ' ▲' : ' ▼';
  };

  // --- Pagination Logic (Unchanged) ---
  const renderPaginationItems = () => {
    const items = [];
    const { totalPages, currentPage } = pagination;
    if (totalPages <= 1) return null;
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );
    return items;
  };

  // --- Content Rendering Logic (Table headers updated) ---
  let content;

  if (isLoading) {
    content = (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (!isLoading && users.length === 0) {
    content = <Alert variant="info">No users found.</Alert>;
  } else {
    content = (
      <Table striped bordered hover responsive className="mt-3">
        {/* ... (thead is unchanged) ... */}
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
              ID {getSortIndicator('id')}
            </th>
            <th
              onClick={() => handleSort('username')}
              style={{ cursor: 'pointer' }}
            >
              Username {getSortIndicator('username')}
            </th>
            <th
              onClick={() => handleSort('email')}
              style={{ cursor: 'pointer' }}
            >
              Email {getSortIndicator('email')}
            </th>
            <th>Role</th>
            <th
              onClick={() => handleSort('isActive')}
              style={{ cursor: 'pointer' }}
            >
              Status {getSortIndicator('isActive')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.Role.name}</td>
              <td>
                {user.isActive ? (
                  <Badge bg="success">Active</Badge>
                ) : (
                  <Badge bg="secondary">Inactive</Badge>
                )}
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowEditModal(user)}
                >
                  Edit
                </Button>
                {/* --- UPDATED: "Delete" button --- */}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleShowDeleteModal(user)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <>
      <Container fluid className="mt-4">
        {/* ... (h2 and Search/Create Row are unchanged) ... */}
        <h2>User Management</h2>
        <Row className="my-3">
          <Col md={6}>
            <Form onSubmit={handleSearchSubmit}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  Search
                </Button>
                <Button variant="outline-secondary" onClick={handleClearSearch}>
                  Clear
                </Button>
              </InputGroup>
            </Form>
          </Col>
          <Col md={6} className="text-md-end mt-2 mt-md-0">
            <Button variant="success" onClick={handleShowCreateModal}>
              + Create New User
            </Button>
          </Col>
        </Row>

        {content}

        {!isLoading && pagination.totalPages > 1 && (
          <Pagination className="justify-content-center">
            {renderPaginationItems()}
          </Pagination>
        )}
      </Container>

      {/* --- Render the Create/Edit Modal --- */}
      <UserFormModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleFormSubmit}
        userToEdit={userToEdit}
        isLoading={userStatus === 'loading'}
        error={userError}
      />

      {/* --- Render the Delete Modal --- */}
      {userToDelete && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          isLoading={userStatus === 'loading'}
          error={userError}
          username={userToDelete.username}
        />
      )}
    </>
  );
};

export default UserManagementPage;