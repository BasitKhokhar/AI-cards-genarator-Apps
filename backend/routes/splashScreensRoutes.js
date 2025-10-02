const express = require('express');
const router = express.Router();
const {
  getSplashImage,
  getSplashScreen2,getSplashScreen3,getSplashScreen4
} = require('../controllers/splashScreensController');

// Routes
router.get('/splash-image', getSplashImage);
router.get('/splash-screen2', getSplashScreen2);
router.get('/splash-screen3', getSplashScreen3);
router.get('/splash-screen4', getSplashScreen4);
module.exports = router;
