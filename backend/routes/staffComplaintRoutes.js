const express = require('express');
const router = express.Router();
const staffComplaintController = require('../controllers/staffComplaintController');
const { protect, adminAuth, staffAuth } = require('../middlewares/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Staff Complaint Route:', {
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

// Staff routes
router.post('/', protect, staffAuth, staffComplaintController.createComplaint);
router.get('/my', protect, staffAuth, staffComplaintController.getMyComplaints);

// Admin routes - no additional protect needed as it's handled in server.js
router.get('/', staffComplaintController.getAllComplaints);
router.patch('/:complaintId', staffComplaintController.updateComplaintStatus);
router.delete('/:complaintId', staffComplaintController.deleteComplaint);

module.exports = router; 