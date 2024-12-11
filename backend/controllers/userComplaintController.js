const UserComplaint = require('../models/UserComplaint');
const catchAsync = require('../utils/catchAsync');

exports.createComplaint = catchAsync(async (req, res) => {
  try {
    const { subject, description, category } = req.body;

    // Validate input lengths before creating complaint
    const validationErrors = [];
    
    if (!subject || subject.trim().length < 3) {
      validationErrors.push('Subject must be at least 3 characters long');
    }
    
    if (!description || description.trim().length < 10) {
      validationErrors.push('Description must be at least 10 characters long');
    }

    if (!category || !['general', 'food', 'service', 'delivery', 'other'].includes(category)) {
      validationErrors.push('Invalid category selected');
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: validationErrors
      });
    }

    // Create complaint with validated data
    const complaintData = {
      userId: req.user._id,
      subject: subject.trim(),
      description: description.trim(),
      category,
      status: 'pending',
      priority: 'medium'
    };

    const complaint = await UserComplaint.create(complaintData);

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: {
        _id: complaint._id,
        subject: complaint.subject,
        description: complaint.description,
        category: complaint.category,
        status: complaint.status,
        createdAt: complaint.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating complaint:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Failed to create complaint',
      error: error.message
    });
  }
});

exports.getUserComplaints = catchAsync(async (req, res) => {
  const complaints = await UserComplaint.find({ userId: req.user._id })
    .sort('-createdAt')
    .select('subject description status category createdAt response');

  res.status(200).json({
    success: true,
    complaints
  });
});

exports.getAllComplaints = catchAsync(async (req, res) => {
  console.log('Getting all user complaints...');
  const complaints = await UserComplaint.find()
    .populate('userId', 'name email')
    .populate('resolvedBy', 'name')
    .sort('-createdAt');

  console.log(`Found ${complaints.length} user complaints`);
  
  res.status(200).json({
    success: true,
    complaints
  });
});

exports.updateComplaintStatus = catchAsync(async (req, res) => {
  const { status, response } = req.body;
  const { complaintId } = req.params;

  if (!['pending', 'in-progress', 'resolved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  const complaint = await UserComplaint.findById(complaintId);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  complaint.status = status;
  if (response) complaint.response = response;
  if (status === 'resolved') {
    complaint.resolvedBy = req.user._id;
    complaint.resolvedAt = new Date();
  }

  await complaint.save();
  await complaint.populate([
    { path: 'userId', select: 'name email' },
    { path: 'resolvedBy', select: 'name' }
  ]);

  console.log('Updated user complaint:', complaint);

  res.status(200).json({
    success: true,
    message: 'Complaint status updated successfully',
    complaint
  });
}); 