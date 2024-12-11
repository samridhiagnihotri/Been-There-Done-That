const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');  // Assuming you have a Comment model
const protect = require('../middleware/authMiddleware');

// POST/GET /api/comments/:postId
router.route('/:postId')
  // GET all comments for a post (with nested replies)
  .get(async (req, res) => {
    try {
      // Fetch top-level comments (where parentId is null)
      const topLevelComments = await Comment.find({ post: req.params.postId, parentId: null })
        .populate('user', 'name')  // Populate user details for the comments
        .exec();

      // Function to recursively fetch replies for each comment
      const populateReplies = async (comment) => {
        const replies = await Comment.find({ parentId: comment._id }).populate('user', 'name');
        const populatedReplies = await Promise.all(replies.map(reply => populateReplies(reply)));  // Recursively populate replies
        return { ...comment.toObject(), replies: populatedReplies };
      };

      // Populate replies for each top-level comment
      const commentsWithReplies = await Promise.all(
        topLevelComments.map(async (comment) => populateReplies(comment))
      );

      res.status(200).json(commentsWithReplies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  
  // POST a new comment (top-level or nested)
  .post(protect, async (req, res) => {
    try {
      const { content, parentId } = req.body;
      const postId = req.params.postId;
      const userId = req.user._id;

      // Validate content
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      // Create comment
      const comment = await Comment.create({
        post: postId,
        user: userId,
        content,
        parentId: parentId || null
      });

      // Populate user info
      await comment.populate('user', 'name');

      res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Failed to create comment' });
    }
  });

module.exports = router;
