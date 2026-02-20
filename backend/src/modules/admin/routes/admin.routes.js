const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { adminAuth } = require('../../../middleware/adminAuth.middleware');

// GET /api/admin/dashboard-stats
// Dashboard Stats
router.get('/dashboard-stats', adminAuth, adminController.getDashboardStats);

// User Management
router.get('/users', adminAuth, adminController.getUsers);
router.get('/users/:id', adminAuth, adminController.getUserDetails);
router.get('/leaderboard', adminAuth, adminController.getLeaderboard);

module.exports = router;
