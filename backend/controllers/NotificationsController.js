const prisma = require("../prisma/client");

// ✅ Get all notifications (latest first)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// ✅ Create new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    const newNotification = await prisma.notification.create({
      data: {
        userId: req.user.id,
        title,
        message,
      },
    });

    res.json({ success: true, notification: newNotification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create notification" });
  }
};

// ✅ Get unread count only
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    res.json({ success: true, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to count unread notifications" });
  }
};

// ✅ Mark a single notification as read
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNotification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { isRead: true },
    });

    res.json({ success: true, notification: updatedNotification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to mark notification as read" });
  }
};

// ✅ Mark all notifications as read (used when modal closes)
exports.markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to mark all as read" });
  }
};
