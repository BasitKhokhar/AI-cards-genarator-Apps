const express = require('express');
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const {  getGeneratedImages } = require('../controllers/ModelController');

// router.post('/enhance',verifyToken, enhanceImage);
router.get('/gallery-images',verifyToken, getGeneratedImages);

module.exports = router;