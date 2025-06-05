const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');


router.get('/', protect, getWishlist);// Get current user's wishlist
router.post('/', protect, addToWishlist);// Add a product to wishlist
router.delete('/', protect, removeFromWishlist);// Remove a product from wishlist

module.exports = router;

/**
 * @swagger
 * /user/wishlist:
 *   get:
 *     summary: Get the current user's wishlist
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add a product to the wishlist
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
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       400:
 *         description: productId is required
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Remove a product from the wishlist
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
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       400:
 *         description: productId is required
 *       401:
 *         description: Unauthorized
 */
