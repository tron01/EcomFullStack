const express = require('express');
const router = express.Router();
const { getAllActivePaymentMethods } = require('../controllers/paymentMethodController');

/**
 * @swagger
 * /payment-methods:
 *   get:
 *     summary: Get all active payment methods
 *     tags: [Payment Methods]
 *     responses:
 *       200:
 *         description: List of active payment methods
 */

router.get('/', getAllActivePaymentMethods);

module.exports = router;