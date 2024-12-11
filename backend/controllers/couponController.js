const Coupon = require('../models/couponModel');
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');

const couponController = {
  // Create a new coupon
  createCoupon: catchAsync(async (req, res) => {
    try {
      const {
        code,
        name,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscount,
        expiryDate,
        usageLimit,
        isActive
      } = req.body;

      // Debug log
      console.log('Creating coupon with data:', req.body);

      // Validate required fields
      if (!code || !name || !discountType || !discountValue || !expiryDate) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Create coupon
      const coupon = await Coupon.create({
        code: code.toUpperCase().trim(),
        name: name.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        expiryDate: new Date(expiryDate),
        usageLimit: usageLimit ? Number(usageLimit) : null,
        isActive: isActive !== undefined ? isActive : true
      });

      res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        coupon
      });
    } catch (error) {
      console.error('Error creating coupon:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create coupon'
      });
    }
  }),

  // Get all coupons
  getAllCoupons: catchAsync(async (req, res) => {
    try {
      const coupons = await Coupon.find().sort('-createdAt');
      res.status(200).json({
        success: true,
        coupons
      });
    } catch (error) {
      console.error('Error fetching coupons:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch coupons'
      });
    }
  }),

  // Delete a coupon
  deleteCoupon: catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findByIdAndDelete(id);
      
      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete coupon'
      });
    }
  }),

  // Validate a coupon
  validateCoupon: catchAsync(async (req, res) => {
    try {
      const { code, orderAmount } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Please provide a coupon code"
        });
      }

      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Invalid coupon code"
        });
      }

      // Check if coupon is expired
      if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
        return res.status(400).json({
          success: false,
          message: "This coupon has expired"
        });
      }

      // Check minimum order amount
      if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`
        });
      }

      // Check if coupon has reached its usage limit
      if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
        return res.status(400).json({
          success: false,
          message: "This coupon has reached its maximum usage limit"
        });
      }

      res.status(200).json({
        success: true,
        coupon: {
          code: coupon.code,
          name: coupon.name,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscount: coupon.maxDiscount
        }
      });
    } catch (error) {
      console.error('Coupon validation error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to validate coupon"
      });
    }
  }),

  // Apply a coupon
  applyCoupon: catchAsync(async (req, res) => {
    try {
      const { code, orderId } = req.body;
      const userId = req.user._id;

      if (!code || !orderId) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code and order ID are required'
        });
      }

      // Find the order
      const order = await Order.findOne({
        _id: orderId,
        userId
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Find and validate coupon
      const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() }
      });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: 'Invalid or expired coupon code'
        });
      }

      // Check minimum order amount
      if (order.totalAmount < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required`
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = (order.totalAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
      } else {
        discountAmount = Math.min(coupon.discountValue, order.totalAmount);
      }

      // Update order
      order.coupon = {
        code: coupon.code,
        discountAmount
      };
      order.finalAmount = order.totalAmount - discountAmount;
      await order.save();

      // Update coupon usage
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      await coupon.save();

      res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        discountAmount,
        finalAmount: order.finalAmount
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      res.status(500).json({
        success: false,
        message: 'Error applying coupon'
      });
    }
  })
};

module.exports = couponController; 