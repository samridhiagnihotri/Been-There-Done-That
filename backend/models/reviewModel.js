const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  foodItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Food'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  comment: {
    type: String,
    trim: true,
    minlength: [5, 'Comment must be at least 5 characters long']
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure that each user can only review a specific food item once
reviewSchema.index({ foodItemId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
