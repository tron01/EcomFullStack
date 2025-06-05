const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { getAllActivePaymentMethods } = require('../controllers/paymentMethodController');




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
