const prisma = require('../prisma/client');

// Get all categories with preview templates
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.cardCategory.findMany({
      include: { templates: { take: 5 } } // show few previews
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get templates by category
exports.getTemplatesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const templates = await prisma.cardTemplate.findMany({
      where: { categoryId: parseInt(categoryId) }
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get template details
exports.getTemplateDetails = async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await prisma.cardTemplate.findUnique({
      where: { id: parseInt(templateId) },
      include: { category: true }
    });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
