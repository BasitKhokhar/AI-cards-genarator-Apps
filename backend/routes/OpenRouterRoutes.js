const express = require('express');
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const { generateImage } = require('../controllers/OpenRouterController');

router.post('/enhance',verifyToken, enhanceImage);
// router.get('/enhanced-images',verifyToken, getEnhancedImages);

module.exports = router;