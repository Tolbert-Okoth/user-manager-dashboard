// routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authJwt = require('../middleware/auth.middleware');

// All routes in this file are protected and require admin access

// POST /api/users
// (Admin) Create a new user
router.post(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.createUser
);

// GET /api/users
// (Admin) Get all users (with pagination, search, sort)
router.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.getAllUsers
);

// GET /api/users/:id
// (Admin) Get a single user by ID
router.get(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.getUserById
);

// PUT /api/users/:id
// (Admin) Update a user's details
router.put(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.updateUser
);

// DELETE /api/users/:id
// (Admin) Delete a user
router.delete(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.deleteUser
);

module.exports = router;