const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { getAllActivePaymentMethods } = require('../controllers/paymentMethodController');



router.get('/cart', protect, getCart);
router.patch('/cart', protect, addToCart);
router.delete('/cart/remove', protect, removeFromCart);
router.delete('/cart/clear', protect, clearCart);
router.get('/payment-methods',protect, getAllActivePaymentMethods);
router.get('/profile', protect, getProfile);

module.exports = router;

/**
 * @swagger
 *  /user/payment-methods:
 *   get:
 *     summary: Get all active payment methods
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of active payment methods
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
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
 */