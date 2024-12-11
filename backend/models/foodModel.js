const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['pasta', 'cold', 'dess', 'hot','sides'],
        message: '{VALUE} is not a valid category'
      }
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500, // Limit description length to prevent overly long descriptions
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v.startsWith('/uploads/') || v.startsWith('http');
        },
        message: 'Invalid image path format'
      }
    },
  },
  { timestamps: true }
);

// Optional: Add an index for faster category searches
foodSchema.index({ category: 1 });

module.exports = mongoose.model("Food", foodSchema);
