const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, staffAuth, adminAuth } = require('../middlewares/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Notification Route:', {
    method: req.method,
    url: req.url,
    path: req.path,
    baseUrl: req.baseUrl,
    hasToken: !!req.headers.authorization,
    user: req.user ? { id: req.user._id, role: req.user.role } : null
  });
  next();
});

// Staff notification routes (both /api/notifications and /api/staff/notifications)
router.post(['/', '/staff'], protect, staffAuth, notificationController.createNotification);
router.get(['/my', '/staff/my'], protect, staffAuth, notificationController.getMyNotifications);

// Admin notification routes
router.get('/admin', protect, adminAuth, notificationController.getNotifications);
router.patch('/admin/:id', protect, adminAuth, notificationController.updateStaffComplaintStatus);
router.delete('/admin/:id', protect, adminAuth, notificationController.deleteNotification);

module.exports = router;
