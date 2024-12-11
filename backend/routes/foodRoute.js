const express = require('express');
const multer = require('multer');
const path = require('path');
const { createFood, updateFood, deleteFood, getAllFoods, getFoodById, getRecommendations } = require('../controllers/foodController');  // Make sure this is correct
const { protect, adminAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Ensure this matches your file upload path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensuring unique filenames
  }
});

const upload = multer({ storage });

// Define routes and connect them with controller functions
router.post('/new', protect, adminAuth, upload.single('image'), createFood); // Correct function call here
router.get('/', getAllFoods); // Correct function call here
router.get('/recommendations', getRecommendations);
router.get('/:id', getFoodById); // Correct function call here
router.put('/:id', protect, adminAuth, upload.single('image'), updateFood); // Correct function call here
router.delete('/:id', protect, adminAuth, deleteFood); // Correct function call here
module.exports = router;
