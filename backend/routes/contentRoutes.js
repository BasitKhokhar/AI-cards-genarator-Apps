// const express = require('express');
// const router = express.Router();
// const { getFAQs, getLogoImage, getSliderImages, getSocialIcons,getPaymentBtnImage } = require('../controllers/contentController');

// router.get('/faqs', getFAQs);
// router.get('/logo_image', getLogoImage);
// router.get('/sliderimages', getSliderImages);
// router.get('/paymentbtnimage', getPaymentBtnImage);
// router.get('/social-icons', getSocialIcons);

// module.exports = router;
const express = require('express');
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const { getAllFaqs, getLogoImage, getSliderImages, getSocialIcons,getPaymentBtnImage,getPrivacyPolicy,getAboutApp
    ,getAboutMe,getMissionVision
 } = require('../controllers/contentController');

router.get('/faqs',verifyToken, getAllFaqs);
router.get('/privacy-policy',verifyToken, getPrivacyPolicy);
router.get('/about-App',verifyToken, getAboutApp);
router.get('/logo_image', getLogoImage);
router.get('/sliderimages',verifyToken, getSliderImages);
router.get('/aboutme', verifyToken, getAboutMe);
router.get('/missionvission', verifyToken, getMissionVision);

router.get('/paymentbtnimage',verifyToken, getPaymentBtnImage);
router.get('/social-icons',verifyToken, getSocialIcons);

module.exports = router;