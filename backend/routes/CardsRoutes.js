const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getCategoriesWithTemplates,
  getTemplateById,
  getTrendingTemplates,
  searchTemplates,
} = require("../controllers/CardsController");

// ✅ Get all categories with templates
router.get("/categories", verifyToken, getCategoriesWithTemplates);

// ✅ Search templates
router.get("/templates/search", verifyToken, searchTemplates);

// ✅ Get single template
router.get("/templates/:id", verifyToken, getTemplateById);

// ✅ Get trending templates with pagination (for home screen)
router.get("/trendingtemplates/home", verifyToken, getTrendingTemplates);

module.exports = router;
