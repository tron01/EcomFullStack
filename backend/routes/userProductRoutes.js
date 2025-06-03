const express = require('express');
const router = express.Router();
const { getAllProductsForUsers, getFullProductByIdForUsers } = require('../controllers/productController');

// Get all products 
router.get('/', getAllProductsForUsers);

// Returns full details: product, category, product detail, images
router.get('/:id', getFullProductByIdForUsers);


module.exports = router;