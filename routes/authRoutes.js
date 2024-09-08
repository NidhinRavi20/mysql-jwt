const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authenticateJWT, authController.getUserProfile);
router.put('/profile', authenticateJWT, authController.editUserProfile);
router.delete('/profile', authenticateJWT, authController.deleteUserProfile);

module.exports = router;
