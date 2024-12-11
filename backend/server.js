const express = require("express");
const cors = require("cors");
const connectDatabase = require("./utils/database");
const path = require('path');
require("dotenv").config();
const multer = require('multer');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { protect } = require('./middlewares/authMiddleware');
const app = express();

// Connect to the database
connectDatabase();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files
const uploadPath = path.join(__dirname, 'public/uploads');
console.log('Upload directory path:', uploadPath);
if (!fs.existsSync(uploadPath)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadPath, { recursive: true });
}
app.use('/uploads', express.static(uploadPath));
console.log('Static file path configured:', uploadPath);

// Import routes
const authRoute = require('./routes/authRoute');
const foodRoute = require('./routes/foodRoute');
const orderRoute = require('./routes/orderRoute');
const reviewRoutes = require('./routes/reviewRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const staffRoutes = require('./routes/staffRoutes');
const staffComplaintRoutes = require('./routes/staffComplaintRoutes');
const userComplaintRoutes = require('./routes/userComplaintRoutes');
const couponRoutes = require('./routes/couponRoutes');

// Debug middleware for all routes
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    baseUrl: req.baseUrl,
    hasToken: !!req.headers.authorization,
    user: req.user ? { id: req.user._id, role: req.user.role } : null
  });
  next();
});

// Basic routes
app.use('/api/auth', authRoute);
app.use('/api/food', foodRoute);
app.use('/api/orders', orderRoute);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/shifts', shiftRoutes);

// User routes
app.use('/api/user', userRoutes);

// Staff routes
app.use('/api/staff', staffRoutes);
app.use('/api/staff/complaints', staffComplaintRoutes);

// Coupon routes
app.use('/api/coupons', protect, (req, res, next) => {
  console.log('Coupon route hit:', {
    method: req.method,
    url: req.url,
    path: req.path,
    user: req.user ? {
      id: req.user._id,
      role: req.user.role
    } : null,
    token: req.headers.authorization
  });

  // Allow validate and apply routes for all authenticated users
  if (req.path === '/validate' || req.path === '/apply') {
    return next();
  }

  // Require admin for all other operations (POST, PUT, DELETE)
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
  next();
}, couponRoutes);

// Admin routes - these should be last to avoid conflicts
app.use('/api/admin', protect, adminRoutes);

// Admin complaint routes
app.use('/api/admin/staff-complaints', protect, (req, res, next) => {
  console.log('Admin staff complaints route hit:', {
    method: req.method,
    url: req.url,
    path: req.path,
    user: req.user ? {
      id: req.user._id,
      role: req.user.role
    } : null,
    token: req.headers.authorization
  });
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
  next();
}, staffComplaintRoutes);

app.use('/api/admin/user-complaints', protect, (req, res, next) => {
  console.log('Admin user complaints route hit:', {
    method: req.method,
    url: req.url,
    path: req.path,
    user: req.user ? {
      id: req.user._id,
      role: req.user.role
    } : null,
    token: req.headers.authorization
  });
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
  next();
}, userComplaintRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false, 
      message: 'File upload error',
      error: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!' 
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
