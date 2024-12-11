const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { ErrorHandler } = require('../utils/errorHandler');

// Check if user is authenticated
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please login to access this resource' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

// Authorize roles middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || 'none'}) is not authorized to access this resource`
      });
    }
    next();
  };
};

// Admin authorization middleware
const adminAuth = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'This resource is restricted to admin users' 
    });
  }
  next();
};

// Staff authorization middleware
const staffAuth = async (req, res, next) => {
  if (!req.user || (req.user.role !== 'staff' && req.user.role !== 'admin')) {
    return res.status(403).json({ 
      success: false, 
      message: 'This resource is restricted to staff members' 
    });
  }
  next();
};

module.exports = {
  protect,
  authorizeRoles,
  adminAuth,
  staffAuth
};
