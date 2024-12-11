const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');

const addReview = async (req, res) => {
  const { foodItemId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  try {
    // Check if user is admin or staff
    const isAdminOrStaff = ['admin', 'staff'].includes(req.user.role);
    
    // If not admin/staff, check if user has purchased the item
    if (!isAdminOrStaff) {
      const hasPurchased = await Order.findOne({
        userId: userId,
        'items.foodItemId': foodItemId,
        status: 'completed'
      });

      if (!hasPurchased) {
        return res.status(403).json({ 
          success: false,
          message: "You can only review items you have purchased" 
        });
      }
    }

    // Validate comment length
    if (!comment ) {
      return res.status(400).json({
        success: false,
        message: "Comment must be at least 5 characters long"
      });
    }

    // Create and save the review
    const review = await Review.create({
      foodItemId,
      userId,
      rating,
      comment,
      isVerifiedPurchase: !isAdminOrStaff
    });

    // Populate user information before sending response
    await review.populate('userId', 'name');

    return res.status(201).json({ 
      success: true,
      message: "Review added successfully!",
      review 
    });
  } catch (error) {
    console.error("Error adding review:", error.stack);
    return res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};

const getReviews = async (req, res) => {
  const { foodItemId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalReviews = await Review.countDocuments({ foodItemId });
    const reviews = await Review.find({ foodItemId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      reviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error.stack);
    return res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};

module.exports = {
  addReview,
  getReviews
};
