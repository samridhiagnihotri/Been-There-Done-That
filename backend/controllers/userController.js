const User = require('../models/userModel');
const Order = require('../models/orderModel');
const UserComplaint = require('../models/UserComplaint');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');

const ErrorHandler = require('../utils/errorHandler');

const userController = {
  getAllUser: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.deleteOne();
      res.status(200).json({ message: "User has been deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  },

  getUserData: async (req, res) => {
    try {
      const userId = req.params.userId;

      const [user, orders] = await Promise.all([
        User.findById(userId),
        Order.find({ user: userId }).sort({ createdAt: -1 }),
      ]);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        orders,
        loyaltyPoints: user.loyaltyPoints || 0,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data" });
    }
  },

  getUserProfile: catchAsync(async (req, res) => {
    const [user, complaints] = await Promise.all([
      User.findById(req.user._id).select('-password'),
      UserComplaint.find({ userId: req.user._id })
        .sort('-createdAt')
        .select('subject description status createdAt')
    ]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user,
      complaints
    });
  }),

  getUserOrders: catchAsync(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id })
      .sort('-createdAt')
      .populate('items.foodItemId', 'name price image')
      .lean();

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.foodItemId?.image
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      address: order.address,
      paymentMethod: order.paymentMethod
    }));

    res.status(200).json({
      success: true,
      orders: formattedOrders
    });
  }),

  updateUserProfile: async (req, res) => {
    try {
      const { name, phone, address } = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      if (name) user.name = name.trim();
      if (phone) user.phone = phone.trim();
      if (address) user.address = address.trim();

      await user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          role: user.role
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: "Error updating profile"
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const isPasswordMatch = await user.matchPassword(currentPassword);
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long"
        });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully"
      });
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({
        success: false,
        message: "Error updating password"
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const userId = req.user._id;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name: name.trim(),
          phone: phone?.trim() || '',
          address: address?.trim() || ''
        },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  },
};

module.exports = userController;
