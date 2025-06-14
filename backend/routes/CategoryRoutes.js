const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
} = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');



// Public: Get all categories & get by ID
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);


module.exports = router;


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */