const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Registration
router.post('/register', validateRegister, authController.register);

// Login
router.post('/login', authController.login);

// Validate token (protected)
router.get('/validate', auth, authController.validate);

// Password reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
