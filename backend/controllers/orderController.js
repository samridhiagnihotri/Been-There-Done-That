const Orders = require("../models/orderModel");
const Users = require("../models/userModel");
const Coupon = require("../models/couponModel");

const orderController = {
  makeOrder: async (req, res) => {
    try {
      const { items, name, email, address, orderType, paymentMethod, subtotal, totalAmount, coupon } = req.body;
      const userId = req.user._id;

      // Validate coupon if provided
      let validCoupon = null;
      if (coupon && coupon.code) {
        validCoupon = await Coupon.findOne({ code: coupon.code });
        
        if (!validCoupon) {
          return res.status(400).json({
            success: false,
            message: "Invalid coupon code"
          });
        }

        // Verify coupon is still valid
        const now = new Date();
        if (validCoupon.expiryDate && new Date(validCoupon.expiryDate) < now) {
          return res.status(400).json({
            success: false,
            message: "Coupon has expired"
          });
        }

        // Verify minimum order amount
        if (validCoupon.minOrderAmount && subtotal < validCoupon.minOrderAmount) {
          return res.status(400).json({
            success: false,
            message: `Minimum order amount of ₹${validCoupon.minOrderAmount} required for this coupon`
          });
        }
      }

      // Create order data object
      const orderData = {
        userId,
        items,
        name,
        email,
        address,
        orderType,
        paymentMethod,
        subtotal,
        totalAmount,
        status: 'pending'
      };

      // Add coupon details if valid coupon was used
      if (validCoupon) {
        orderData.coupon = {
          code: validCoupon.code,
          discountAmount: coupon.discountAmount
        };
      }

      // Create the order using Orders model
      const order = await Orders.create(orderData);

      // Update coupon usage if applicable
      if (validCoupon) {
        validCoupon.usageCount = (validCoupon.usageCount || 0) + 1;
        await validCoupon.save();
      }

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order
      });

    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message
      });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Orders.find()
        .select('name email items address status totalAmount createdAt')
        .populate('items.foodItemId', 'name price')
        .sort({ createdAt: -1 })
        .limit(50);
      
      res.status(200).json({ 
        success: true,
        orders 
      });
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch orders" 
      });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      const orders = await Orders.find({ userId: req.user._id })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      console.error("Error in getUserOrders:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders"
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order status'
        });
      }

      // Find and update the order
      const order = await Orders.findById(orderId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update status
      order.status = status;
      await order.save();

      // Send notification to user (if implemented)
      // You can add notification logic here

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order
      });

    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error.message
      });
    }
  },

  getStaffOrders: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const orders = await Orders.find({ 
        status: 'pending' 
      })
      .select('name email items totalAmount createdAt status')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

      const formattedOrders = orders.map(order => ({
        _id: order._id,
        name: order.name,
        email: order.email,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity
        })),
        totalAmount: order.totalAmount,
        formattedAmount: new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(order.totalAmount),
        createdAt: order.createdAt
      }));
      
      res.status(200).json({ 
        success: true,
        orders: formattedOrders
      });
    } catch (error) {
      console.error("Error in getStaffOrders:", error);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch orders" 
      });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const order = await Orders.findByIdAndDelete(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete order'
      });
    }
  }
};

module.exports = orderController; 