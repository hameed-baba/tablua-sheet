const express = require('express');
const { validate, schemas } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { authController } = require('../controllers');

const router = express.Router();

// Staff login
router.post('/login', validate(schemas.login), authController.login);

// Staff logout
router.post('/logout', authenticate, authController.logout);

// Change password
router.put('/change-password', authenticate, validate(schemas.changePassword), authController.changePassword);

// Get current user profile
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;