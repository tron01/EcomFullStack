const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
  specifications: { type: mongoose.Schema.Types.Mixed },
  additionalInfo: { type: mongoose.Schema.Types.Mixed },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }], // Non-thumbnail images
}, {
  timestamps: true,
});

module.exports = mongoose.model('ProductDetail', productDetailSchema);