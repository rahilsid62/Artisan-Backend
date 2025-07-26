const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get logged-in user's profile
router.get('/profile', auth, userController.getProfile);

// Update profile
router.put('/profile', auth, userController.updateProfile);

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// Get all artisans
router.get('/artisans', userController.getArtisans);
// Get single artisan by ID
router.get('/artisans/:id', userController.getArtisanById);

// Wishlist endpoints
router.get('/wishlist', auth, userController.getWishlist);
router.post('/wishlist', auth, userController.addToWishlist);
router.delete('/wishlist/:productId', auth, userController.removeFromWishlist);

module.exports = router;
