const prisma = require("../prisma/client");

// ✅ Get all categories with only template thumbnails (id + imageUrl)
exports.getCategoriesWithTemplates = async (req, res) => {
  console.log("📥 [API] /cards/categories called");

  try {
    // fetch categories with minimal template info
    const categories = await prisma.cardCategory.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        templates: {
          select: { id: true, imageUrl: true }, // ✅ only return id + imageUrl
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!categories || categories.length === 0) {
      console.warn("⚠️ No categories found");
      return res.status(404).json({ message: "No categories found" });
    }

    console.log("✅ Categories with template previews fetched");
    res.json(categories);
  } catch (err) {
    console.error("❌ Error in getCategoriesWithTemplates:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Get a single template by ID with full details
exports.getTemplateById = async (req, res) => {
  console.log("📥 [API] /cards/templates/:id called", req.params);

  try {
    const { id } = req.params;
    const templateId = parseInt(id);

    if (isNaN(templateId)) {
      return res.status(400).json({ message: "Invalid template ID" });
    }

    const template = await prisma.cardTemplate.findUnique({
      where: { id: templateId },
      include: { category: true },
    });

    if (!template) {
      console.warn("⚠️ Template not found for ID:", templateId);
      return res.status(404).json({ message: "Template not found" });
    }

    console.log("✅ Template fetched:", template.title);
    res.json(template);
  } catch (err) {
    console.error("❌ Error in getTemplateById:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
