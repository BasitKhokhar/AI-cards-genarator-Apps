const prisma = require("../prisma/client");

// ✅ Get all categories with only template thumbnails (id + imageUrl)

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.cardCategory.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        _count: { select: { templates: true } },
      },
    });

    if (!categories.length)
      return res.status(404).json({ message: "No categories found" });

    res.json(categories);
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/** ✅ Fetch templates for a specific category (with pagination)*/
exports.getTemplatesByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [templates, totalCount] = await Promise.all([
      prisma.cardTemplate.findMany({
        where: { categoryId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: { id: true, imageUrl: true },
      }),
      prisma.cardTemplate.count({ where: { categoryId } }),
    ]);

    res.status(200).json({
      templates,
      hasMore: skip + limit < totalCount,
    });
  } catch (err) {
    console.error("❌ Error fetching category templates:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// fetch a tempalte details by id when user click on any template
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
      return res.status(404).json({ message: "Template not found" });
    }

    let isFavourite = false;

    // ✅ If user is logged in, check if they favorited this
    if (req.user?.id) {
      const fav = await prisma.userFavouriteTemplate.findFirst({
        where: {
          userId: req.user.id,
          templateId: templateId,
        },
      });
      isFavourite = !!fav;
    }

    // ✅ Count how many users favorited this template
    const favouriteCount = await prisma.userFavouriteTemplate.count({
      where: { templateId },
    });

    res.json({
      ...template,
      isFavourite,
      favouriteCount,
      usageCount: template.uses || 0, // ✅ use column directly
    });
  } catch (err) {
    console.error("❌ Error in getTemplateById:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get single image details from gallery table
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // 👈 safely extract from token middleware

    console.log("🆔 Image ID:", id, "| 👤 User ID:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing user ID" });
    }

    // ✅ Fetch image owned by this user (protects from unauthorized access)
    const image = await prisma.userGeneratedImage.findFirst({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });

    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found or not owned by user" });
    }

    return res.status(200).json({
      success: true,
      image: {
        id: image.id,
        url: image.imageUrl,
        prompt: image.prompt,
        createdAt: image.createdAt,
        resolution: image.resolution,
        aspectratio: image.aspectRatio,
        model: image.model || "Seedream 4.0 (mock)",
      },
    });
  } catch (err) {
    console.error("❌ Error fetching image details:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ Get Trending Templates (with pagination for infinite scroll)
exports.getTrendingTemplates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default = 1
    const limit = parseInt(req.query.limit) || 10; // default = 10
    const skip = (page - 1) * limit;

    // ✅ Fetch templates ordered by popularity
    const templates = await prisma.cardTemplate.findMany({
      orderBy: { uses: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        // description: true,
        imageUrl: true,
        // prompt: true,
        // uses: true,
        // aspectRatio: true,
        // createdAt: true,
      },
    });

    const totalCount = await prisma.cardTemplate.count();

    res.status(200).json({
      templates,
      hasMore: skip + limit < totalCount, 
    });
  } catch (err) {
    console.error("❌ Error fetching trending templates:", err);
    res.status(500).json({ error: "Failed to fetch trending templates" });
  }
};

// ✅ search templates by user searching
exports.searchTemplates = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    console.log("🔍 Incoming search query:", q);

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // ✅ Parameterized SQL query
    const templates = await prisma.$queryRawUnsafe(
      `
      SELECT id, title, description, imageUrl, aspectRatio, uses, categoryId, createdAt
      FROM cardTemplate
      WHERE LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
      `,
      `%${q}%`,
      `%${q}%`,
      parseInt(limit),
      skip
    );

    const totalCount = await prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*) as count
      FROM cardTemplate
      WHERE LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)
      `,
      `%${q}%`,
      `%${q}%`
    );

    const total = Number(totalCount[0]?.count || 0);

    // ✅ Convert BigInt fields safely
    const cleanTemplates = templates.map((t) => ({
      ...t,
      id: Number(t.id),
      categoryId: t.categoryId ? Number(t.categoryId) : null,
      uses: t.uses ? Number(t.uses) : 0,
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : null,
    }));

    console.log(`✅ ${cleanTemplates.length} templates found for "${q}" (Page ${page})`);

    return res.status(200).json({
      templates: cleanTemplates,
      page: parseInt(page),
      total,
      hasMore: skip + cleanTemplates.length < total,
    });
  } catch (err) {
    console.error("❌ Error in searchTemplates:", err);
    return res.status(500).json({
      message: "Server error while searching templates",
      error: err.message,
    });
  }
};


/**
 * ✅ Fetch templates for a specific category/usecommmunity btn (with pagination + hasMore flag)
 */
exports.getTemplatesBySpecificCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Fetch templates with pagination
    const [templates, totalCount] = await Promise.all([
      prisma.cardTemplate.findMany({
        where: { categoryId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          aspectRatio: true,
          uses: true,
        },
      }),
      prisma.cardTemplate.count({ where: { categoryId } }),
    ]);

    // Clean BigInts (if any)
    const cleanTemplates = templates.map((t) => ({
      ...t,
      id: Number(t.id),
      uses: t.uses ? Number(t.uses) : 0,
    }));

    res.status(200).json({
      templates: cleanTemplates,
      hasMore: skip + limit < totalCount,
    });
  } catch (err) {
    console.error("❌ Error fetching category templates:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getRelatedTemplates = async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log("📥 Incoming Related Template Request:", { templateId, page, limit });

    // 🟡 CASE 1: No valid template ID — return popular templates
    if (isNaN(templateId)) {
      console.log("⚠️ No template ID provided, returning popular templates instead.");
      const templates = await prisma.cardTemplate.findMany({
        orderBy: { uses: "desc" },
        take: limit,
        skip,
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          aspectRatio: true,
          uses: true,
          categoryId: true,
          createdAt: true,
        },
      });

      return res.status(200).json({
        templates: templates.map((t) => ({
          ...t,
          id: Number(t.id),
          uses: Number(t.uses || 0),
          categoryId: Number(t.categoryId),
          createdAt: new Date(t.createdAt).toISOString(),
        })),
        hasMore: false,
      });
    }

    // 🟢 CASE 2: Valid template ID — fetch related ones
    const baseTemplate = await prisma.cardTemplate.findUnique({
      where: { id: templateId },
      select: { id: true, categoryId: true, prompt: true, title: true },
    });

    if (!baseTemplate) {
      console.log("❌ Base template not found");
      return res.status(404).json({ message: "Template not found" });
    }

    const searchKeywords = baseTemplate.prompt
      ? baseTemplate.prompt.split(" ").slice(0, 3).join(" ")
      : baseTemplate.title;

    console.log("🔍 Searching related using keywords:", searchKeywords);

    const templates = await prisma.$queryRawUnsafe(
      `
      SELECT id, title, description, imageUrl, aspectRatio, uses, categoryId, createdAt
      FROM cardTemplate
      WHERE id != ?
      AND (
        categoryId = ?
        OR LOWER(prompt) LIKE LOWER(?)
        OR LOWER(title) LIKE LOWER(?)
      )
      ORDER BY uses DESC
      LIMIT ? OFFSET ?
      `,
      templateId,
      baseTemplate.categoryId,
      `%${searchKeywords}%`,
      `%${searchKeywords}%`,
      limit,
      skip
    );

    const totalCount = await prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*) as count
      FROM cardTemplate
      WHERE id != ?
      AND (
        categoryId = ?
        OR LOWER(prompt) LIKE LOWER(?)
        OR LOWER(title) LIKE LOWER(?)
      )
      `,
      templateId,
      baseTemplate.categoryId,
      `%${searchKeywords}%`,
      `%${searchKeywords}%`
    );

    const total = Number(totalCount[0]?.count || 0);

    res.status(200).json({
      templates: templates.map((t) => ({
        ...t,
        id: Number(t.id),
        uses: Number(t.uses || 0),
        categoryId: Number(t.categoryId),
        createdAt: new Date(t.createdAt).toISOString(),
      })),
      hasMore: skip + limit < total,
    });
  } catch (err) {
    console.error("❌ Error in getRelatedTemplates:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
