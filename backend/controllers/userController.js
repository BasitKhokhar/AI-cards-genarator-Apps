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

exports.PostProfileImage = async (req, res) => {
  const { user_id, image_url } = req.body;

  try {
    const existingImage = await prisma.userimages.findUnique({
      where: { user_id },
    });

    if (existingImage) {
      await prisma.userimages.update({
        where: { user_id },
        data: { image_url },
      });
    } else {
      await prisma.userimages.create({
        data: { user_id, image_url },
      });
    }

    res.status(200).json({ message: 'Profile image updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile image' });
  }
};
