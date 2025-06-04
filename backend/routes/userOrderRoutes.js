const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');
const { getOrderById } = require('../controllers/orderController');

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for the current user
 *     tags: [User Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID (user only)
 *     tags: [User Orders]
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
 *     tags: [User Orders]
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
 *                 enum: [cancelled]
 *     responses:
 *       200:
 *         description: Order cancelled
 *       404:
 *         description: Order not found
 */

// Get all orders for the current user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('paymentMethod')
      .populate({
        path: 'items',
        populate: { path: 'product' }
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific order by ID (only if it belongs to the user)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate('paymentMethod')
      .populate({
        path: 'items',
        populate: { path: 'product' }
      });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Allow user to cancel their order
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (status !== 'cancelled') {
      return res.status(400).json({ message: 'Invalid status update' });
    }
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;