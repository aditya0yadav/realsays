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

// Provider Management
router.get('/providers', adminAuth, adminController.getProviders);
router.patch('/providers/:id', adminAuth, adminController.updateProviderStatus);

module.exports = router;
