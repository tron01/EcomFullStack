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