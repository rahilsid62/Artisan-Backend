const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Add a review to a product
router.post('/', auth, reviewController.addReview);

// Get reviews for a product
router.get('/:productId', reviewController.getReviews);

module.exports = router;
