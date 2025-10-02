const prisma = require('../prisma/client');

exports.uploadProfileImage = async (req, res) => {
  const { user_id, image_url } = req.body;
  if (!user_id || !image_url) return res.status(400).json({ error: "Missing fields" });

  try {
    await prisma.userimages.upsert({
      where: { userId: user_id },
      update: { image_url },
      create: { userId: user_id, image_url },
    });
    res.json({ message: "Profile image updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserImage = async (req, res) => {
  const userId = parseInt(req.params.storedUserId);
  try {
    const image = await prisma.userimages.findFirst({ where: { userId } });
    if (!image) return res.status(404).json({ message: "No image found for this user" });
    res.json({ image_url: image.image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};