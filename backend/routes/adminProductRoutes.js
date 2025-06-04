const express = require('express');
const { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getFullProductById,
  addOrUpdateProductImages,
  updateProductIsActive,
  getProductIsActive,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Admin Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               stock: { type: number }
 *               description: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 *
 *   get:
 *     summary: Get all products (admin only)
 *     tags: [Admin Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *
 * /admin/products/{id}:
 *   get:
 *     summary: Get full product details by ID (admin only)
 *     tags: [Admin Products]
 *     security:
 *       - cookieAuth: []
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
 *   put:
 *     summary: Update a product by ID
 *     tags: [Admin Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               stock: { type: number }
 *               description: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Admin Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *
 * /admin/products/{id}/images:
 *   post:
 *     summary: Add or update product images
 *     tags: [Admin Products]
 *     security:
 *       - cookieAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded/updated
 *       404:
 *         description: Product not found
 *
 * /admin/products/{id}/is-active:
 *   patch:
 *     summary: Update isActive status of a product
 *     tags: [Admin Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: isActive status updated
 *       404:
 *         description: Product not found
 *   get:
 *     summary: Get isActive status of a product
 *     tags: [Admin Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: isActive status
 *       404:
 *         description: Product not found
 */

router.post('/', protect, authorizeRoles('admin'), createProduct);
router.put('/:id', protect, authorizeRoles('admin'), updateProduct);
// Update only isActive status
router.patch('/:id/is-active', protect, authorizeRoles('admin'), updateProductIsActive);
router.get('/:id/is-active', protect, authorizeRoles('admin'), getProductIsActive);

router.post('/:id/images',protect,authorizeRoles('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 3 }
  ]),
  addOrUpdateProductImages);

router.get('/', protect, authorizeRoles('admin'), getAllProducts);
router.get('/:id', protect, authorizeRoles('admin'), getFullProductById);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;