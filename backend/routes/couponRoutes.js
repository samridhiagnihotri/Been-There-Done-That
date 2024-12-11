const express = require('express');
const router = express.Router();
const { protect, adminAuth } = require('../middlewares/authMiddleware');
const couponController = require('../controllers/couponController');

// Customer routes (requires only authentication)
router.post('/validate', couponController.validateCoupon);
router.post('/apply', couponController.applyCoupon);

// Admin-only routes
router.post('/', adminAuth, couponController.createCoupon);
router.get('/', adminAuth, couponController.getAllCoupons);
router.delete('/:id', adminAuth, couponController.deleteCoupon);

module.exports = router; 