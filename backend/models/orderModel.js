const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    isRecommended: { type: Boolean, default: false }
  }],
  orderType: { 
    type: String, 
    enum: ['dine-in', 'takeout', 'delivery'],
    required: true 
  },
  address: { 
    type: String, 
    required: function() { 
      return this.orderType === 'delivery'; 
    }
  },
  paymentMethod: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subtotal: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  coupon: {
    code: { type: String },
    discountAmount: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add a pre-save hook to ensure totalAmount is always calculated correctly
orderSchema.pre('save', function(next) {
  // Calculate subtotal from all items
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Apply coupon discount if present
  if (this.coupon && this.coupon.discountAmount) {
    this.totalAmount = Math.max(0, this.subtotal - this.coupon.discountAmount);
  } else {
    this.totalAmount = this.subtotal;
  }

  next();
});

// Create index for faster user queries
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
