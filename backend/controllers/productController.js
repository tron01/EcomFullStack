const Product = require('../models/Product');
const ProductDetail = require('../models/ProductDetail');
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');
const Category = require('../models/Category'); 


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('thumbnail');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFullProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate({
        path: 'detail',
        populate: { path: 'images' }
      });
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
          try {
            if (publicId) {
              const result = await cloudinary.uploader.destroy(publicId);
              console.log('Cloudinary image deletion result:', result);
            }
          } catch (cloudErr) {
            console.log('Cloudinary image deletion error:', cloudErr);
          }
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
          try {
            if (publicId) {
              const result = await cloudinary.uploader.destroy(publicId);
              console.log('Cloudinary image deletion result:', result);
            }
          } catch (cloudErr) {
            console.log('Cloudinary image deletion error:', cloudErr);
          }
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
        console.log('Deleting thumbnail with publicId:', publicId);

        try {
          if (publicId) {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log('Cloudinary thumbnail deletion result:', result);
          }
        } catch (cloudErr) {
          console.log('Cloudinary thumbnail deletion error:', cloudErr);
        }   
  
        await thumbImg.deleteOne();
      }
    }

    // Delete detail images from Cloudinary and DB
    if (product.detail && product.detail.images && product.detail.images.length > 0) {
      
      const detailImages = await Image.find({ _id: { $in: product.detail.images } });
      
      for (const img of detailImages) {
        
        const publicId = getPublicIdFromUrl(img.url);
      
        try {
          if (publicId) {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log('Cloudinary image deletion result:', result);
          }
        } catch (cloudErr) {
          console.log('Cloudinary image deletion error:', cloudErr);
        }

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

// helper function 
function getPublicIdFromUrl(url) {

  if (!url) return null;
  
  // Remove query params
  url = url.split('?')[0];
  
    try {
      // Match the pattern after the version number
      const regex = /\/v\d+\/(.+)\./;
      const matches = url.match(regex);
      
      if (matches && matches[1]) {
        console.log('Extracted public ID:', matches[1]);
        return matches[1]; // This will be "products/mbgqy8q0xbyivhdvo5bj"
      }
      
      // Fallback to old method if regex doesn't match
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex === -1) return null;
      
      // Get everything after /upload/
      let pathAfterUpload = url.substring(uploadIndex + 8);
      
      // Remove version number if present (vXXXXXXXXX/)
      pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
      
      // Remove extension
      const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
      
      console.log('Extracted public ID (fallback):', publicId);
      return publicId;
    } catch (err) {
      console.log('Error extracting public ID:', err);
      return null;
    }

}