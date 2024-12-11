const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const { protect, staffAuth, adminAuth } = require('../middlewares/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Shift Route:', {
    method: req.method,
    url: req.url,
    hasToken: !!req.headers.authorization
  });
  next();
});

// Routes accessible by both staff and admin
router.get('/', protect, shiftController.getStaffShifts);

// Admin-only routes
router.get('/all', protect, adminAuth, shiftController.getAllShifts);
router.post('/', protect, adminAuth, shiftController.createShift);
router.delete('/:id', protect, adminAuth, shiftController.deleteShift);

module.exports = router;


