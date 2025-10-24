// routes/analytics.routes.js

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authJwt = require('../middleware/auth.middleware');

// GET /api/analytics/stats
// (Protected by the same admin-only middleware)
router.get(
  '/stats',
  [authJwt.verifyToken, authJwt.isAdmin],
  analyticsController.getStats
);

module.exports = router;