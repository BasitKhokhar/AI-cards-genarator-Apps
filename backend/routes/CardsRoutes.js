const express = require("express");
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const { getCategoriesWithTemplates, getTemplateById,getTrendingTemplates } = require("../controllers/CardsController");


router.get("/categories", verifyToken, getCategoriesWithTemplates);
router.get("/templates/:id", verifyToken, getTemplateById);

// Trending
router.get("/trendingtemplates/home",verifyToken, getTrendingTemplates);


module.exports = router;
