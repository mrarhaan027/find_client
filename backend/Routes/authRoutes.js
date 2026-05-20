const express = require('express');
const router = express.Router();
const { signup, signin, logout, getMe } = require('../Controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
