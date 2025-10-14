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

/**
 * ✅ Fetch templates for a specific category (with pagination)
 */
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



// exports.getCategoriesWithTemplates = async (req, res) => {
//   console.log("📥 [API] /cards/categories called");

//   try {
//     // fetch categories with minimal template info
//     const categories = await prisma.cardCategory.findMany({
//       orderBy: { createdAt: "asc" },
//       include: {
//         templates: {
//           select: { id: true, imageUrl: true }, // ✅ only return id + imageUrl
//           orderBy: { createdAt: "desc" },
//         },
//       },
//     });

//     if (!categories || categories.length === 0) {
//       console.warn("⚠️ No categories found");
//       return res.status(404).json({ message: "No categories found" });
//     }

//     console.log("✅ Categories with template previews fetched");
//     res.json(categories);
//   } catch (err) {
//     console.error("❌ Error in getCategoriesWithTemplates:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// ✅ Get a single template by ID with full details
// exports.getTemplateById = async (req, res) => {
//   console.log("📥 [API] /cards/templates/:id called", req.params);

//   try {
//     const { id } = req.params;
//     const templateId = parseInt(id);

//     if (isNaN(templateId)) {
//       return res.status(400).json({ message: "Invalid template ID" });
//     }

//     const template = await prisma.cardTemplate.findUnique({
//       where: { id: templateId },
//       include: { category: true },
//     });

//     if (!template) {
//       console.warn("⚠️ Template not found for ID:", templateId);
//       return res.status(404).json({ message: "Template not found" });
//     }

//     let isFavourite = false;

//     // ✅ if user is logged in (verifyToken middleware must add req.user)
//     if (req.user?.id) {
//       const fav = await prisma.userFavouriteTemplate.findFirst({
//         where: {
//           userId: req.user.id,
//           templateId: templateId,
//         },
//       });
//       isFavourite = !!fav;
//     }

//     console.log("✅ Template fetched:", template.title, " | Favourite:", isFavourite);

//     res.json({
//       ...template,
//       isFavourite, // ✅ send favourite status
//     });
//   } catch (err) {
//     console.error("❌ Error in getTemplateById:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

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
        description: true,
        imageUrl: true,
        prompt: true,
        uses: true,
        aspectRatio: true,
        createdAt: true,
      },
    });

    const totalCount = await prisma.cardTemplate.count();

    res.status(200).json({
      templates,
      hasMore: skip + limit < totalCount, // ✅ tells frontend if more data available
    });
  } catch (err) {
    console.error("❌ Error fetching trending templates:", err);
    res.status(500).json({ error: "Failed to fetch trending templates" });
  }
};

// ✅ src/controllers/CardsController.js
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
