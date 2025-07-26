const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Create order
router.post('/', auth, orderController.createOrder);

// Get user's orders (customer or artisan)
router.get('/', auth, orderController.getOrders);

// Update order status
router.put('/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;
