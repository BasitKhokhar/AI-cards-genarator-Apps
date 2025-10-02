const express = require('express');
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const { getUser, updateUser, getUserImage,PostProfileImage } = require('../controllers/userController');
router.get('/:userId',verifyToken, getUser);
router.put('/:id',verifyToken, updateUser);
router.get('/user_images/:userId',verifyToken, getUserImage);
router.post('/upload-profile-image',verifyToken, PostProfileImage);
module.exports = router;