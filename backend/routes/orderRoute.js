const express = require("express");
const orderController = require("../controllers/orderController");
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create order
router.post("/", protect, orderController.makeOrder);

// Get all orders
router.get("/", protect, orderController.getAllOrders);

// Get user orders
router.get("/user", protect, orderController.getUserOrders);

// Delete order
router.delete("/:id", protect, orderController.deleteOrder);

// Update order status
router.patch('/:orderId', protect, orderController.updateOrderStatus);

module.exports = router;
