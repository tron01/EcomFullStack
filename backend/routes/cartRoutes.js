const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { checkout } = require('../controllers/checkoutController');



router.get('/', protect, getCart);
router.patch('/', protect, addToCart);
router.delete('/remove', protect, removeFromCart);
router.delete('/clear', protect, clearCart);
// POST /api/cart/checkout
router.post('/checkout', protect, checkout);


module.exports = router;

// ...existing code...

/**
 * @swagger
 * /user/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User's cart
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Add or update a product in the cart
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: number }
 *     responses:
 *       200:
 *         description: Cart updated
 *       401:
 *         description: Unauthorized
 *
 * /user/cart/remove:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string }
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       401:
 *         description: Unauthorized
 *
 * /user/cart/clear:
 *   delete:
 *     summary: Clear the cart
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       401:
 *         description: Unauthorized
 *
 * /user/cart/checkout:
 *   post:
 *     summary: Checkout the current user's cart and create an order
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *               paymentMethod:
 *                 type: string
 *                 example: "credit card"
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart is empty or unsupported payment method
 *       401:
 *         description: Unauthorized
 */