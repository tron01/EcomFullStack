const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getUserOrders,
  getUserOrderById,
  cancelUserOrder
} = require('../controllers/orderController');


router.get('/', protect, getUserOrders);// Get all orders for the current user
router.get('/:id', protect, getUserOrderById);// Get a specific order by ID (only if it belongs to the user)
router.patch('/:id', protect, cancelUserOrder);// Allow user to cancel their order


module.exports = router;


/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for the current user
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID (user only)
 *     tags: [User]
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
 *     summary: Cancel the user's order (if allowed)
 *     tags: [User]
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
 *         description: Order cancelled
 *       404:
 *         description: Order not found
 */