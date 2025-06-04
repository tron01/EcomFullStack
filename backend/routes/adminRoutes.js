/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 *
 * /admin/create-user:
 *   post:
 *     summary: Create a user as admin
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: User already exists
 */
const express = require('express');
const router = express.Router();
const { getAllUsers, createUserByAdmin } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.post('/create-user', protect, authorizeRoles('admin'), createUserByAdmin);

module.exports = router;
