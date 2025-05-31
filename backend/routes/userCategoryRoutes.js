const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
} = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Public: Get all categories & get by ID
router.get('/', protect,getAllCategories);
router.get('/:id',protect, getCategoryById);


module.exports = router;