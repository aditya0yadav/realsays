const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { protect } = require('../../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/firebase', authController.firebaseAuth);
router.post('/refresh', authController.refresh);
router.post('/admin/login', authController.adminLogin);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', protect, authController.getMe);
router.post('/change-password', protect, authController.changePassword);

module.exports = router;
