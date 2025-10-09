const prisma = require('../prisma/client');

exports.getUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: { user_id: true, name: true, email: true, phone: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
exports.updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, phone } = req.body;
  try {
    await prisma.users.update({ where: { user_id: userId }, data: { name, email, phone } });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
exports.getUserImage = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const user = await prisma.userimages.findFirst({
      where: { user_id: userId },
      select: { image_url: true },
    });
    console.log("User Image:", user);
    if (!user) return res.status(404).json({ message: 'User Image not found' });
    res.status(200).json({ userImage: user.image_url });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user name' });
  }
};

// controllers/userController.js
exports.PostProfileImage = async (req, res) => {
  try {
    let { user_id, image_url } = req.body;

    // 🧩 Convert user_id to integer safely (even if undefined or string)
    const userIdInt = Number(user_id);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user_id provided" });
    }

    console.log("🧠 Parsed user_id:", userIdInt);
    console.log("🖼️ Image URL:", image_url);

    // ✅ Check if a record exists for this user
    const existingImage = await prisma.userimages.findUnique({
      where: { user_id: userIdInt },
    });

    let result;
    if (existingImage) {
      console.log("🔁 Updating existing profile image...");
      result = await prisma.userimages.update({
        where: { user_id: userIdInt },
        data: { image_url },
      });
    } else {
      console.log("🆕 Creating new profile image record...");
      result = await prisma.userimages.create({
        data: { user_id: userIdInt, image_url },
      });
    }

    return res.status(200).json({
      message: "✅ Profile image saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in PostProfileImage:", error);
    return res.status(500).json({
      message: "Server error while saving profile image",
      error: error.message,
    });
  }
};
