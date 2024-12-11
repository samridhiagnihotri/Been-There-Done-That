const Shift = require('../models/Shift');
const User = require('../models/userModel');

// Fetch all shifts
exports.getAllShifts = async (req, res) => {
  console.log('Fetching all shifts...');
  try {
    const shifts = await Shift.find()
      .populate('staffId', 'name email')
      .sort({ date: 1, startTime: 1 });

    console.log(`Found ${shifts.length} shifts`);
    res.status(200).json({ 
      success: true, 
      shifts: shifts || [] 
    });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    // Return empty array with success true to prevent error message
    res.status(200).json({ 
      success: true, 
      shifts: [],
      message: 'No shifts found'
    });
  }
};

// Create new shift
exports.createShift = async (req, res) => {
  try {
    console.log('Creating new shift with data:', req.body);
    const { staffEmail, date, startTime, endTime } = req.body;

    // Validate required fields
    if (!staffEmail || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        missing: {
          staffEmail: !staffEmail,
          date: !date,
          startTime: !startTime,
          endTime: !endTime
        }
      });
    }

    // Find staff user by email
    const staffUser = await User.findOne({ email: staffEmail, role: 'staff' });
    if (!staffUser) {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff email or user is not a staff member'
      });
    }

    // Create shift with staffId instead of staffEmail
    const shift = await Shift.create({
      staffId: staffUser._id,
      date: new Date(date),
      startTime,
      endTime,
      status: 'scheduled'
    });

    // Populate the staff details for response
    const populatedShift = await Shift.findById(shift._id)
      .populate('staffId', 'name email');

    console.log('Shift created successfully:', populatedShift._id);
    res.status(201).json({ 
      success: true, 
      message: 'Shift created successfully',
      shift: populatedShift 
    });
  } catch (error) {
    console.error('Error creating shift:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create shift',
      error: error.message 
    });
  }
};

// Update shift
exports.updateShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'Shift not found'
      });
    }

    res.status(200).json({ success: true, shift });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete shift
exports.deleteShift = async (req, res) => {
  try {
    console.log('Deleting shift:', req.params.id);
    const shift = await Shift.findByIdAndDelete(req.params.id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'Shift not found'
      });
    }

    console.log('Shift deleted successfully:', req.params.id);
    res.status(200).json({ 
      success: true, 
      message: 'Shift deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting shift:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete shift',
      error: error.message 
    });
  }
};

// Get staff shifts (by staffId)
exports.getStaffShifts = async (req, res) => {
  try {
    console.log('Fetching shifts for staff:', req.user._id);
    const staffUser = await User.findById(req.user._id);
    
    if (!staffUser || (staffUser.role !== 'staff' && staffUser.role !== 'admin')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Staff or admin only.' 
      });
    }

    // If admin, return all shifts, if staff return only their shifts
    const query = staffUser.role === 'admin' ? {} : { staffId: staffUser._id };
    
    const shifts = await Shift.find(query)
      .populate('staffId', 'name email')
      .sort({ date: 1, startTime: 1 });

    console.log(`Found ${shifts.length} shifts`);
    res.status(200).json({ 
      success: true, 
      shifts 
    });
  } catch (error) {
    console.error('Error fetching staff shifts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch staff shifts',
      error: error.message 
    });
  }
};
