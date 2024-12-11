const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:foodItemId', protect, addReview);
router.get('/:foodItemId', getReviews);

module.exports = router;