const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', required: true }],
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);