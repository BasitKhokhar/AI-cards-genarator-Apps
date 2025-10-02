const express = require('express');
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const { uploadProfileImage, getUserImage } = require('../controllers/imageController');

router.post('/upload-profile-image',verifyToken, uploadProfileImage);
router.get('/user/:storedUserId',verifyToken, getUserImage);

module.exports = router;