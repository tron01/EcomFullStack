const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Credit Card", "PayPal"
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);