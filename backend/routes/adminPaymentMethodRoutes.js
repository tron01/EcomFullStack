const express = require('express');
const router = express.Router();
const {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod
} = require('../controllers/paymentMethodController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /admin/payment-methods:
 *   post:
 *     summary: Create a new payment method
 *     tags: [Admin Payment Methods]
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
 *     tags: [Admin Payment Methods]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of payment methods
 *
 * /admin/payment-methods/{id}:
 *   get:
 *     summary: Get payment method by ID (admin only)
 *     tags: [Admin Payment Methods]
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
 *     tags: [Admin Payment Methods]
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
 *     tags: [Admin Payment Methods]
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

// Create a new payment method
router.post('/', protect, authorizeRoles('admin'), createPaymentMethod);

// Get all payment methods
router.get('/', protect, authorizeRoles('admin'), getAllPaymentMethods);

// Get a payment method by ID
router.get('/:id', protect, authorizeRoles('admin'), getPaymentMethodById);

// Update a payment method
router.put('/:id', protect, authorizeRoles('admin'), updatePaymentMethod);

// Delete a payment method
router.delete('/:id', protect, authorizeRoles('admin'), deletePaymentMethod);

module.exports = router;