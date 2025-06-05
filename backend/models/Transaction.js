const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true
  },

  provider: {
    type: String,
    required: true, // e.g. 'Stripe', 'PayPal', 'COD'
    lowercase: true,
    trim: true
  },

  providerTransactionId: {
    type: String, // Stripe paymentIntent ID, PayPal order ID, etc.
    trim: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: 'usd'
  },

  status: {
    type: String,
    enum: ['initiated', 'pending', 'success', 'failed', 'refunded'],
    default: 'initiated'
  },

  isRefunded: {
    type: Boolean,
    default: false
  },

  refundAmount: {
    type: Number,
    default: 0
  },

  responseData: {
    type: mongoose.Schema.Types.Mixed // Gateway response JSON (optional)
  }

}, { timestamps: true });

// Helpful indexes for queries
transactionSchema.index({ order: 1 });
transactionSchema.index({ user: 1 });
transactionSchema.index({ provider: 1 });
transactionSchema.index({ providerTransactionId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
