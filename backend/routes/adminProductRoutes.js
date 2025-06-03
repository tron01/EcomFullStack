const express = require('express');
const { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getFullProductById,
  addOrUpdateProductImages,
  updateProductIsActive,
  getProductIsActive,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), createProduct);
router.put('/:id', protect, authorizeRoles('admin'), updateProduct);
// Update only isActive status
router.patch('/:id/is-active', protect, authorizeRoles('admin'), updateProductIsActive);
router.get('/:id/is-active', protect, authorizeRoles('admin'), getProductIsActive);

router.post('/:id/images',protect,authorizeRoles('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 3 }
  ]),
  addOrUpdateProductImages);

router.get('/', protect, authorizeRoles('admin'), getAllProducts);
router.get('/:id', protect, authorizeRoles('admin'), getFullProductById);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;