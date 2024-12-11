const express = require('express');
const router = express.Router();
const userComplaintController = require('../controllers/userComplaintController');
const { protect, adminAuth } = require('../middlewares/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('User Complaint Route:', {
    method: req.method,
    url: req.url,
    path: req.path,
    user: req.user ? {
      id: req.user._id,
      role: req.user.role
    } : null,
    token: req.headers.authorization
  });
  next();
});

// User routes
router.post('/', protect, userComplaintController.createComplaint);
router.get('/my', protect, userComplaintController.getUserComplaints);

// Admin routes
router.get('/', protect, adminAuth, userComplaintController.getAllComplaints);
router.patch('/:complaintId', protect, adminAuth, userComplaintController.updateComplaintStatus);

module.exports = router; 