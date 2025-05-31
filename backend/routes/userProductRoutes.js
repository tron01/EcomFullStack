const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../controllers/productController');

// Get all products (public)
router.get('/', getAllProducts);

// Get product by ID (public)
router.get('/:id', getProductById);

module.exports = router;