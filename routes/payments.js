const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Process payment (demo)
router.post('/checkout', auth, paymentController.checkout);

module.exports = router;
