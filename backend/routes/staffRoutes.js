const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect, staffAuth } = require('../middlewares/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Staff Route:', {
    method: req.method,
    url: req.url,
    hasToken: !!req.headers.authorization
  });
  next();
});

// Stats route
router.get('/stats', protect, staffAuth, staffController.getStats);

// Orders routes
router.get('/orders', protect, staffAuth, staffController.getStaffOrders);

module.exports = router;
