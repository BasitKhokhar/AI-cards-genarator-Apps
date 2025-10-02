const express = require('express');
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const {getVideoFeatures, generateVideo,getGeneratedVideos } = require('../controllers/videosController');

router.get('/videosfeatures',verifyToken, getVideoFeatures);
router.post('/enhancevideos',verifyToken, generateVideo);
// router.get('/user/:storedUserId',verifyToken, getGeneratedVideos);

module.exports = router;