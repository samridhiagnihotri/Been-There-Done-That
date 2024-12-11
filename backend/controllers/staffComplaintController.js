const StaffComplaint = require('../models/StaffComplaint');
const catchAsync = require('../utils/catchAsync');

const staffComplaintController = {
  // Get all staff complaints (admin only)
  getAllComplaints: catchAsync(async (req, res) => {
    console.log('Fetching all staff complaints');
    
    const complaints = await StaffComplaint.find()
      .populate('staffId', 'name email')
      .populate('resolvedBy', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      complaints
    });
  }),

  // Get complaints for a specific staff member
  getMyComplaints: catchAsync(async (req, res) => {
    const complaints = await StaffComplaint.find({ staffId: req.user._id })
      .populate('resolvedBy', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      complaints
    });
  }),

  // Create a new complaint
  createComplaint: catchAsync(async (req, res) => {
    const { description, priority, department } = req.body;

    // Validate required fields
    if (!description || !department) {
      return res.status(400).json({
        success: false,
        message: 'Description and department are required'
      });
    }

    const complaint = await StaffComplaint.create({
      staffId: req.user._id,
      description,
      priority: priority || 'low',
      department,
      status: 'pending'
    });

    await complaint.populate('staffId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint
    });
  }),

  // Update complaint status (admin only)
  updateComplaintStatus: catchAsync(async (req, res) => {
    const { status, response } = req.body;
    const { complaintId } = req.params;

    // Validate status
    if (!['pending', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const complaint = await StaffComplaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Update complaint
    complaint.status = status;
    if (response) complaint.response = response;
    if (status === 'resolved') {
      complaint.resolvedBy = req.user._id;
      complaint.resolvedAt = new Date();
    }

    await complaint.save();
    await complaint.populate([
      { path: 'staffId', select: 'name email' },
      { path: 'resolvedBy', select: 'name' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint
    });
  }),

  // Delete a complaint (admin only)
  deleteComplaint: catchAsync(async (req, res) => {
    const { complaintId } = req.params;

    const complaint = await StaffComplaint.findByIdAndDelete(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  })
};

module.exports = staffComplaintController; 