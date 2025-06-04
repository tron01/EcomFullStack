const express = require('express');
const router = express.Router();
const { getAllProductsForUsers, getFullProductByIdForUsers } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');



router.get('/', getAllProductsForUsers);// Get all products 
router.get('/:id', getFullProductByIdForUsers);// Returns full details: product, category, product detail, images



module.exports = router;


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all active products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get full product details by ID (if active)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
