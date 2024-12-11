const User = require('../models/userModel');
const Order = require('../models/orderModel');
const errorHandler = require('../utils/errorHandler');

const adminController = {
  getStats: async (req, res) => {
    try {
      console.log('Fetching admin stats...');

      // Initialize default stats
      const stats = {
        orders: {
          total: 0,
          completed: 0,
          pending: 0,
          cancelled: 0
        },
        totalRevenue: 0,
        dailyRevenue: Array(7).fill(0),
        dailyOrders: Array(7).fill(0)
      };

      // Get orders count by status
      const orderCount = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Process order counts
      if (orderCount && orderCount.length > 0) {
        orderCount.forEach(item => {
          if (item._id) {
            stats.orders[item._id.toLowerCase()] = item.count;
          }
        });
        stats.orders.total = orderCount.reduce((acc, item) => acc + item.count, 0);
      }

      // Get total revenue from completed orders
      const totalRevenue = await Order.aggregate([
        {
          $match: { status: 'completed' }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);

      if (totalRevenue && totalRevenue.length > 0) {
        stats.totalRevenue = totalRevenue[0].total || 0;
      }

      // Get daily stats for last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const dailyStats = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      // Process daily stats
      if (dailyStats && dailyStats.length > 0) {
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayStat = dailyStats.find(stat => stat._id === dateStr);
          if (dayStat) {
            const dayIndex = 6 - i;
            stats.dailyRevenue[dayIndex] = dayStat.revenue;
            stats.dailyOrders[dayIndex] = dayStat.orders;
          }
        }
      }

      console.log('Stats fetched successfully:', stats);

      res.status(200).json({
        success: true,
        stats
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stats',
        error: error.message
      });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({ 
        success: true,
        users: users.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }))
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching users' 
      });
    }
  },

  // Get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  },

  // Delete user by ID
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.deleteOne();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      const validRoles = ['user', 'staff', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid role specified' 
        });
      }

      // Prevent self-role change
      if (id === req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Cannot modify your own role' 
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Error updating user role' 
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Debug logs
      console.log('Update request received:', {
        orderId: id,
        newStatus: status,
        user: req.user?._id,
        method: req.method,
        url: req.originalUrl
      });

      // Validate inputs
      if (!id) {
        console.log('Missing order ID');
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      if (!status) {
        console.log('Missing status in request');
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      // Validate status value
      const validStatuses = ['pending', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        console.log('Invalid status:', status);
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      // Find the order
      const order = await Order.findById(id);
      
      if (!order) {
        console.log('Order not found:', id);
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update the order
      order.status = status;
      await order.save();

      console.log('Order updated successfully:', {
        orderId: order._id,
        oldStatus: order.status,
        newStatus: status
      });

      // Send success response
      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order: {
          _id: order._id,
          status: order.status,
          updatedAt: order.updatedAt
        }
      });

    } catch (error) {
      console.error('Error in updateOrderStatus:', {
        error: error.message,
        stack: error.stack
      });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error.message
      });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndDelete(orderId);
      
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
  },

  // Get all staff members
  getStaffMembers: async (req, res) => {
    try {
      const staffMembers = await User.find({ role: 'staff' })
        .select('name email phone')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        staff: staffMembers
      });
    } catch (error) {
      console.error('Error fetching staff members:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch staff members'
      });
    }
  }
};

module.exports = adminController;
