const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getCategories,
  getTemplatesByCategory,getTemplatesBySpecificCategory,
  getTemplateById,
  getTrendingTemplates,
  searchTemplates,
} = require("../controllers/CardsController");

// ✅ Get all categories
router.get("/categories", verifyToken, getCategories);

// ✅ Get templates for a specific category (paginated)
router.get("/categories/:id/templates", verifyToken, getTemplatesBySpecificCategory);

// ✅ Get templates for a specific category (paginated)
router.get("/categories/:id/templates", verifyToken, getTemplatesByCategory);
// ✅ Search templates
router.get("/templates/search", verifyToken, searchTemplates);

// ✅ Get a single template
router.get("/templates/:id", verifyToken, getTemplateById);

// ✅ Get trending templates (for infinite scroll)
router.get("/trendingtemplates/home", verifyToken, getTrendingTemplates);

module.exports = router;
