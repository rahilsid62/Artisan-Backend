const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all products (with optional filters)
router.get('/', productController.getAll);

// Search products
router.get('/search', productController.search);

// Get product by ID
router.get('/:id', productController.getById);

// Create product (artisan only, with image upload)
router.post('/', auth, upload.array('images', 5), productController.create);

// Update product
router.put('/:id', auth, upload.array('images', 5), productController.update);

// Delete product
router.delete('/:id', auth, productController.delete);

module.exports = router;
