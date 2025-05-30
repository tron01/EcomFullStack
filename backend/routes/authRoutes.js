const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

module.exports = router;
