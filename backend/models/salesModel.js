const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  items: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true
    },
    name: String,  // This could be populated when needed from the Food model
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    validate: {
      validator: function() {
        const calculatedTotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return calculatedTotal === this.totalAmount;
      },
      message: 'Total amount must be the sum of item prices * quantities.'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexing for faster querying by orderId and status
salesSchema.index({ orderId: 1 });
salesSchema.index({ status: 1 });
salesSchema.index({ date: 1 });

module.exports = mongoose.model('Sales', salesSchema);
