const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, required: true, default: 0 },
  thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }, // Reference to main image
  detail: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetail' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);