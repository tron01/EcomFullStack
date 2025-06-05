const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
    required: true
  }],

  shippingAddress: {
    type: String,
    required: true
  },

  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ['initiated', 'pending', 'paid', 'failed', 'refunded'],
    default: 'initiated'
  },

  latestTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },

  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }

}, { timestamps: true });

// Helpful indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
