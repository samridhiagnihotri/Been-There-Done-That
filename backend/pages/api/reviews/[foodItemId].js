import { connectDB } from '../../../utils/db';
import { verifyToken } from '../../../middleware/auth';
import Review from '../../../models/reviewModel';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      // Verify user token
      const user = await verifyToken(req);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { foodItemId } = req.query;
      const { rating, comment } = req.body;

      // Validate rating
      if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
      }

      // Check for existing review
      const existingReview = await Review.findOne({ 
        foodItemId, 
        userId: user._id 
      });

      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this item." });
      }

      // Create review
      const review = await Review.create({
        foodItemId,
        userId: user._id,
        rating,
        comment
      });

      return res.status(201).json({ 
        success: true,
        message: 'Review added successfully!',
        review 
      });

    } catch (error) {
      console.error('Error adding review:', error);
      if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ message: 'You have already reviewed this item' });
      }
      return res.status(500).json({ message: 'Failed to add review' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { foodItemId } = req.query;
      const reviews = await Review.find({ foodItemId })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });

      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
} 