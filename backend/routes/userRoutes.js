const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { getAllActivePaymentMethods } = require('../controllers/paymentMethodController');
const {  login, logout  } = require('../controllers/authController');




router.get('/payment-methods',protect, getAllActivePaymentMethods);
router.get('/profile', protect, getProfile);
router.post('/login', login);
router.post('/logout', protect, logout);

module.exports = router;
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
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
 * /user/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [User]
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
