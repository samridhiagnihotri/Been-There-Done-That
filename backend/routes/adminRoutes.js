const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminAuth } = require('../middlewares/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Admin Route:', {
    method: req.method,
    url: req.url,
    hasToken: !!req.headers.authorization
  });
  next();
});

// Apply middleware to all routes
router.use(protect);
router.use(adminAuth);

// Stats route
router.get('/stats', adminController.getStats);

// User management routes
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.updateUserRole);

// Order management routes
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id', adminController.updateOrderStatus);
router.delete('/orders/:orderId', adminController.deleteOrder);

// Staff management routes
router.get('/staff', adminController.getStaffMembers);

module.exports = router;