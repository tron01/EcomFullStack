const express = require('express');
const router = express.Router();
const { getAllProducts, getFullProductById } = require('../controllers/productController');

// Get all products 
router.get('/', getAllProducts);

// Returns full details: product, category, product detail, images
router.get('/:id', getFullProductById);


module.exports = router;