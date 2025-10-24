// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/register-admin
router.post('/register-admin', authController.registerAdmin);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;