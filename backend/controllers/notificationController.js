const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');

const notificationController = {
  createNotification: catchAsync(async (req, res) => {
    console.log('Creating notification:', {
      body: req.body,
      user: req.user ? { id: req.user._id, role: req.user.role } : null,
      headers: {
        authorization: !!req.headers.authorization,
        contentType: req.headers['content-type']
      }
    });

    const { type, message, priority } = req.body;

    // Validate required fields
    if (!type || !message) {
      return res.status(400).json({
        success: false,
        message: 'Type and message are required'
      });
    }

    // Validate type
    if (!['complaint', 'restock'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification type. Must be either "complaint" or "restock".'
      });
    }

    // Validate priority
    if (priority && !['low', 'normal', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority level. Must be "low", "normal", or "high".'
      });
    }

    // Validate user role
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only staff members can create notifications'
      });
    }

    const notification = new Notification({
      staffId: req.user._id,
      type,
      message,
      priority: priority || 'normal'
    });
    
    await notification.save();
    
    console.log('Notification created:', notification);
    
    res.status(201).json({ 
      success: true, 
      message: 'Notification sent successfully',
      notification: {
        _id: notification._id,
        type: notification.type,
        message: notification.message,
        priority: notification.priority,
        status: notification.status,
        createdAt: notification.createdAt
      }
    });
  }),

  getMyNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({ staffId: req.user._id })
        .sort({ createdAt: -1 });
      
      console.log(`Found ${notifications.length} notifications for staff member:`, req.user._id);
      
      res.status(200).json({
        success: true,
        notifications: notifications.map(notification => ({
          _id: notification._id,
          type: notification.type,
          message: notification.message,
          priority: notification.priority,
          status: notification.status,
          createdAt: notification.createdAt
        }))
      });
    } catch (error) {
      console.error('Error fetching staff notifications:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch notifications',
        error: error.message
      });
    }
  },

  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find()
        .populate('staffId', 'name email')
        .sort({ createdAt: -1 });
      
      console.log('Fetched all notifications:', notifications.length);
      
      res.status(200).json({
        success: true,
        notifications: notifications.map(notification => ({
          _id: notification._id,
          type: notification.type,
          message: notification.message,
          priority: notification.priority,
          status: notification.status,
          createdAt: notification.createdAt,
          staff: {
            name: notification.staffId?.name || 'Unknown',
            email: notification.staffId?.email || 'N/A'
          }
        }))
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch notifications',
        error: error.message
      });
    }
  },

  updateStaffComplaintStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log('Updating notification status:', { id, status });

      // Validate status
      if (!['pending', 'resolved'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }

      const notification = await Notification.findById(id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      notification.status = status;
      await notification.save();

      console.log('Updated notification:', notification);

      res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        notification: {
          _id: notification._id,
          type: notification.type,
          message: notification.message,
          priority: notification.priority,
          status: notification.status,
          createdAt: notification.createdAt
        }
      });
    } catch (error) {
      console.error('Error updating notification status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update notification status',
        error: error.message
      });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const notification = await Notification.findByIdAndDelete(req.params.id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      console.log('Deleted notification:', req.params.id);

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification',
        error: error.message
      });
    }
  }
};

module.exports = notificationController;
