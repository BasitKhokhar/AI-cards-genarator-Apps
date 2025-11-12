const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getNotifications,
  createNotification,
  getUnreadCount,
  markRead,
  markAllRead,
} = require("../controllers/NotificationsController");

router.get("/allnotifications", verifyToken, getNotifications);
router.post("/Createnotifications", verifyToken, createNotification);
router.get("/notifications/unread/count", verifyToken, getUnreadCount);
router.put("/mark-as-read/:id", verifyToken, markRead);
router.put("/mark-all-read", verifyToken, markAllRead);

module.exports = router;
