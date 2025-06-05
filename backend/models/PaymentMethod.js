const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Prevent duplicate entries like multiple "Cash on Delivery"
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
