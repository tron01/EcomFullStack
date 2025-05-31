const Product = require('../models/Product');
const ProductDetail = require('../models/ProductDetail');
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');
const Category = require('../models/Category'); 


// Get all products with populated detail
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('detail')
      .populate('category')
      .populate('thumbnail');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('detail')
      .populate('category')
      .populate('thumbnail');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Product (JSON only, no images)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category,stock,description,specifications, 
       additionalInfo } = req.body;

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    // Create ProductDetail first (no images yet)
    const detail = await ProductDetail.create({
      specifications,
      additionalInfo,
      images: []
    });

    // Create Product (no thumbnail yet)
    const product = await Product.create({
      name,
      price,
      category,
      stock,
      description,
      detail: detail._id
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('detail');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, category, stock, description, specifications, additionalInfo } = req.body;

    // Update main fields
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    // Validate category if provided
    if (category !== undefined) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      product.category = category;
    }
    if (stock !== undefined) product.stock = stock;
    if (description !== undefined) product.description = description;

    // Update detail fields
    if (product.detail) {
      if (specifications !== undefined) product.detail.specifications = specifications;
      if (additionalInfo !== undefined) product.detail.additionalInfo = additionalInfo;
      await product.detail.save();
    }

    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addOrUpdateProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('detail');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Handle thumbnail
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      // Delete old thumbnail if exists
      if (product.thumbnail) {
        const oldThumb = await Image.findById(product.thumbnail);
        if (oldThumb) {
          const publicId = getPublicIdFromUrl(oldThumb.url);
          if (publicId) await cloudinary.uploader.destroy(publicId);
          await oldThumb.deleteOne();
        }
      }
      const thumbnailImage = await Image.create({
        url: req.files.thumbnail[0].path,
        alt: `${product.name} thumbnail`,
        isThumbnail: true,
        product: product._id
      });
      product.thumbnail = thumbnailImage._id;
    }

    // Handle detail images
    let detailImages = [];
    if (req.files && req.files.images) {
      // Delete old detail images if exist
      if (product.detail && product.detail.images && product.detail.images.length > 0) {
        const oldImages = await Image.find({ _id: { $in: product.detail.images } });
        for (const img of oldImages) {
          const publicId = getPublicIdFromUrl(img.url);
          if (publicId) await cloudinary.uploader.destroy(publicId);
          await img.deleteOne();
        }
      }
      detailImages = await Promise.all(req.files.images.map(file =>
        Image.create({
          url: file.path,
          alt: `${product.name} image`,
          isThumbnail: false,
          product: product._id
        })
      ));
      if (product.detail) {
        product.detail.images = detailImages.map(img => img._id);
        await product.detail.save();
      }
    }

    await product.save();
    res.json({ message: 'Images uploaded/updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('detail');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete thumbnail image from Cloudinary and DB
    if (product.thumbnail) {
      const thumbImg = await Image.findById(product.thumbnail);
      if (thumbImg) {
        const publicId = getPublicIdFromUrl(thumbImg.url);
        if (publicId) await cloudinary.uploader.destroy(publicId);
        await thumbImg.deleteOne();
      }
    }

    // Delete detail images from Cloudinary and DB
    if (product.detail && product.detail.images && product.detail.images.length > 0) {
      const detailImages = await Image.find({ _id: { $in: product.detail.images } });
      for (const img of detailImages) {
        const publicId = getPublicIdFromUrl(img.url);
        if (publicId) await cloudinary.uploader.destroy(publicId);
        await img.deleteOne();
      }
      await ProductDetail.findByIdAndDelete(product.detail._id);
    }

    // Delete the product itself (remove duplicate findByIdAndDelete)
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add this helper function at the top of the file after imports
function getPublicIdFromUrl(url) {
  if (!url) return null;
  url = url.split('?')[0]; // Remove query params
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return null;
  const publicIdWithExtension = url.substring(uploadIndex + 8);
  return publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove extension
}