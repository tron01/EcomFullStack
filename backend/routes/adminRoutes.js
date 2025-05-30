const express = require('express');
const router = express.Router();
const { getAllUsers, createUserByAdmin } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.post('/create-user', protect, authorizeRoles('admin'), createUserByAdmin);

module.exports = router;
