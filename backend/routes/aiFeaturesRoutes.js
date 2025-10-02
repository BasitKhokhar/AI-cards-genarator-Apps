const express = require('express');
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const {getAllFeatures,getSubfeaturesByFeatureId,} = require('../controllers/aiFeaturesController');

// Route to get all features
router.get('/ai_pics_Featureslist',verifyToken, getAllFeatures);

// Route to get subfeatures by feature ID
router.get('/ai_subfeatures/:featureId',verifyToken, getSubfeaturesByFeatureId);

module.exports = router;
