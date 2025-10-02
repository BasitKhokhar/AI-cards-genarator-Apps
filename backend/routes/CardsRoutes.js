const express = require("express");
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const {getCategories,getTemplatesByCategory,getTemplateDetails} = require("../controllers/CardsController");

router.get("/categories", verifyToken, getCategories);
router.get("/templates/:categoryId",verifyToken ,getTemplatesByCategory);
router.get("/template/:templateId",verifyToken ,getTemplateDetails);

module.exports = router;
