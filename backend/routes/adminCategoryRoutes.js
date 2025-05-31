const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Admin only: All routes
router.get('/', protect, authorizeRoles('admin'), getAllCategories);
router.get('/:id', protect, authorizeRoles('admin'), getCategoryById);
router.post('/', protect, authorizeRoles('admin'), createCategory);
router.put('/:id', protect, authorizeRoles('admin'), updateCategory);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;