const Food = require("../models/foodModel");
const path = require('path');
const fs = require('fs');

// Helper function for deleting old images
const deleteOldImage = async (imagePath) => {
  if (!imagePath || imagePath.startsWith('http')) return;

  const fullPath = path.join(__dirname, '../public', imagePath);
  try {
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      console.log('Old image deleted:', fullPath);
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
  }
};

// Function to create a new food item
const createFood = async (req, res) => {
  try {
    const { name, category, cost, description } = req.body;
    if (!name || !category || !cost) {
      return res.status(400).json({ message: "Name, category, and cost are required" });
    }

    if (isNaN(cost) || cost <= 0) {
      return res.status(400).json({ message: "Cost must be a positive number" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Only JPEG, JPG, and PNG files are allowed" });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const newFood = new Food({
      name,
      category,
      cost,
      description,
      image: imagePath,
    });

    const savedFood = await newFood.save();
    res.status(201).json({ success: true, data: savedFood });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a food item
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFood = await Food.findById(id);
    if (!deletedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Delete the associated image file
    await deleteOldImage(deletedFood.image);
    
    // Delete the food item from database
    await Food.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, message: "Food item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get all food items
const getAllFoods = async (req, res) => {
  try {
    console.log('Fetching foods...');
    const foods = await Food.find().sort({ category: 1, createdAt: -1 });
    
    if (!foods || foods.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const groupedFoods = foods.reduce((acc, food) => {
      const foodObj = food.toObject();
      const imageUrl = foodObj.image?.startsWith('http') 
        ? foodObj.image 
        : `${process.env.BACKEND_URL}/uploads/${path.basename(foodObj.image)}`;
      foodObj.image = imageUrl;
      
      if (!acc[food.category]) {
        acc[food.category] = [];
      }
      acc[food.category].push(foodObj);
      return acc;
    }, {});

    res.status(200).json({ 
      success: true, 
      data: foods,
      categorizedData: groupedFoods
    });
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to get a food item by its ID
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getRecommendations = async (req, res) => {
  try {
    console.log('Fetching recommendations...');
    const { categories } = req.query;
    
    let query = {};
    if (categories) {
      const categoryList = categories.split(',');
      // Find items in similar categories but limit to different items
      query = { category: { $in: categoryList } };
    }

    // Get random food items
    const recommendations = await Food.aggregate([
      { $match: query },
      { $sample: { size: 3 } } // Limit to 3 random items
    ]);

    // Process image URLs and price
    const processedRecommendations = recommendations.map(food => {
      let imageUrl = food.image;
      if (!imageUrl.startsWith('http')) {
        // Remove any existing slashes and ensure proper formatting
        imageUrl = imageUrl.replace(/^\/+/, '').replace(/\\/g, '/');
        imageUrl = `${process.env.BACKEND_URL}/${imageUrl}`;
      }

      // Handle price field - ensure it's a valid number
      let price = 0;
      if (typeof food.cost === 'number') {
        price = food.cost;
      } else if (food.cost?.$numberDecimal) {
        price = parseFloat(food.cost.$numberDecimal);
      } else if (typeof food.cost === 'string') {
        price = parseFloat(food.cost) || 0;
      }

      return {
        ...food,
        image: imageUrl,
        price: price // Add the price field explicitly as a number
      };
    });

    console.log(`Found ${processedRecommendations.length} recommendations`);
    console.log('Sample recommendation:', {
      id: processedRecommendations[0]?._id,
      name: processedRecommendations[0]?.name,
      price: processedRecommendations[0]?.price,
      image: processedRecommendations[0]?.image
    });

    res.status(200).json({
      success: true,
      recommendations: processedRecommendations
    });
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Function to update a food item
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Get existing food item to delete old image if needed
    const existingFood = await Food.findById(id);
    if (!existingFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Only JPEG, JPG and PNG files are allowed" });
      }
      // Delete old image before updating
      await deleteOldImage(existingFood.image);
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedFood });
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ message: error.message });
  }
};

// Exporting the controller functions
module.exports = {
  createFood,
  updateFood,
  deleteFood,
  getAllFoods,
  getFoodById,
  getRecommendations,
  deleteOldImage
};
