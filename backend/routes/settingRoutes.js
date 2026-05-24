const express = require('express');
const router = express.Router();
const { getSliderImages, addSliderImage, removeSliderImage } = require('../controllers/settingController');
const { protect, isAdmin } = require('../middleware/auth');

// Public route to get images
router.get('/slider', getSliderImages);

// Admin only routes
router.post('/slider', protect, isAdmin, addSliderImage);
router.delete('/slider/:imageId', protect, isAdmin, removeSliderImage);

module.exports = router;
