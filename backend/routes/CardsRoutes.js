const express = require("express");
const router = express.Router();
const {verifyToken, }= require('../middleware/authMiddleware');
const { getCategoriesWithTemplates, getTemplateById } = require("../controllers/CardsController");

// ✅ Get all categories with templates (minimal info)
router.get("/categories", verifyToken, getCategoriesWithTemplates);

// ✅ Get a single template with full details
router.get("/templates/:id", verifyToken, getTemplateById);

module.exports = router;
