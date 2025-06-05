const express = require('express');
const router = express.Router();
const { getAllUsers, createUserByAdmin } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
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
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const upload = require('../middlewares/upload');
const {
  getAllOrders,
  getOrderDetailsById,
  updateOrderStatus
} = require('../controllers/orderController');
const {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod
} = require('../controllers/paymentMethodController');
const { login, logout  } = require('../controllers/authController');

//login
router.post('/login', login);
router.post('/logout', protect, logout);

//Users
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.post('/create-user', protect, authorizeRoles('admin'), createUserByAdmin);

//Products
router.post('/products', protect, authorizeRoles('admin'), createProduct);
router.put('/products/:id', protect, authorizeRoles('admin'), updateProduct);
router.patch('/products/:id/is-active', protect, authorizeRoles('admin'), updateProductIsActive);// Update only isActive status
router.get('/products/:id/is-active', protect, authorizeRoles('admin'), getProductIsActive);
router.post('/products/:id/images',protect,authorizeRoles('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 3 }
  ]),
  addOrUpdateProductImages);
router.get('/products', protect, authorizeRoles('admin'), getAllProducts);
router.get('/products/:id', protect, authorizeRoles('admin'), getFullProductById);
router.delete('/products/:id', protect, authorizeRoles('admin'), deleteProduct);
//Category
router.get('/categories', protect, authorizeRoles('admin'), getAllCategories);
router.get('/categories/:id', protect, authorizeRoles('admin'), getCategoryById);
router.post('/categories', protect, authorizeRoles('admin'), createCategory);
router.put('/categories/:id', protect, authorizeRoles('admin'), updateCategory);
router.delete('/categories/:id', protect, authorizeRoles('admin'), deleteCategory);
//Orders
router.get('/orders', protect, authorizeRoles('admin'), getAllOrders);
router.get('/orders/:id', protect, authorizeRoles('admin'), getOrderDetailsById);
router.patch('/orders/:id', protect, authorizeRoles('admin'), updateOrderStatus);
//Payment methods
router.post('/payment-methods/', protect, authorizeRoles('admin'), createPaymentMethod); // Create a new payment method
router.get('/payment-methods/', protect, authorizeRoles('admin'), getAllPaymentMethods);// Get all payment methods
router.get('/payment-methods/:id', protect, authorizeRoles('admin'), getPaymentMethodById);// Get a payment method by ID
router.put('/payment-methods/:id', protect, authorizeRoles('admin'), updatePaymentMethod);// Update a payment method
router.delete('/payment-methods/:id', protect, authorizeRoles('admin'), deletePaymentMethod);// Delete a payment method


/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login a user
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /admin/payment-methods:
 *   post:
 *     summary: Create a new payment method
 *     tags: [Admin]
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
 *               description: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Payment method created
 *       400:
 *         description: Validation error
 *   get:
 *     summary: Get all payment methods (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of payment methods
 *
 * /admin/payment-methods/{id}:
 *   get:
 *     summary: Get payment method by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment Method ID
 *     responses:
 *       200:
 *         description: Payment method found
 *       404:
 *         description: Payment method not found
 *   put:
 *     summary: Update a payment method (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment Method ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Payment method updated
 *       404:
 *         description: Payment method not found
 *   delete:
 *     summary: Delete a payment method (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment Method ID
 *     responses:
 *       200:
 *         description: Payment method deleted
 *       404:
 *         description: Payment method not found
 */
/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *
 * /admin/orders/{id}:
 *   get:
 *     summary: Get order by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *   patch:
 *     summary: Update order status (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Admin]
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
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *
 * /admin/products/{id}:
 *   get:
 *     summary: Get full product details by ID (admin only)
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 *
 * /admin/create-user:
 *   post:
 *     summary: Create a user as admin
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: User already exists
 */

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Get all categories (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     summary: Create a new category (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Category already exists
 *
 * /admin/categories/{id}:
 *   get:
 *     summary: Get category by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update a category (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete a category (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */


module.exports = router;
