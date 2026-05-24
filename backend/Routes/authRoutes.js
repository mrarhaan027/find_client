const express = require('express');
const router = express.Router();
const { signup, signin, signout, getMe, googleAuth } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');
const { getUsers } = require('../controllers/adminController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.post('/google', googleAuth);
router.get('/me', getMe);

// Admin Routes
router.get('/admin/users', protect, isAdmin, getUsers);
module.exports = router;
