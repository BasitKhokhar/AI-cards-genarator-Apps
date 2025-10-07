const prisma = require("../prisma/client");

exports.toggleFavourite = async (req, res) => {
  try {
    const userId = req.user.id; // assuming user is authenticated
    const { templateId } = req.params;

    if (req.method === "POST") {
      const fav = await prisma.userFavouriteTemplate.create({
        data: { userId, templateId: parseInt(templateId) },
      });
      return res.json({ success: true, favourite: true });
    }

    if (req.method === "DELETE") {
      await prisma.userFavouriteTemplate.deleteMany({
        where: { userId, templateId: parseInt(templateId) },
      });
      return res.json({ success: true, favourite: false });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("❌ Favourite error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getUserFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favourites = await prisma.userFavouriteTemplate.findMany({
      where: { userId },
      include: {
        template: true, // assuming relation: userFavouriteTemplate -> template
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(favourites.map(f => ({
      id: f.id,
      templateId: f.templateId,
      createdAt: f.createdAt,
      template: {
        id: f.template.id,
        title: f.template.title,
        imageUrl: f.template.imageUrl,
        prompt: f.template.prompt,
        aspectRatio: f.template.aspectRatio,
      }
    })));
  } catch (err) {
    console.error("❌ Error fetching favourites:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};