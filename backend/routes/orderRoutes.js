const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

// Add this route
router.put('/:orderId/status', protect, staffOnly, orderController.updateOrderStatus);

module.exports = router;