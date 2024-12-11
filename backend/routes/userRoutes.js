const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const userComplaintController = require('../controllers/userComplaintController');

// Protected user routes
router.get('/profile', protect, userController.getUserProfile);
router.put('/update', protect, userController.updateUserProfile);
router.get('/orders', protect, userController.getUserOrders);

// User complaints routes
router.post('/complaints', protect, userComplaintController.createComplaint);
router.get('/complaints', protect, userComplaintController.getUserComplaints);

module.exports = router;
