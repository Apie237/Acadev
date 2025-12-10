// routes/notification.js
import express from "express";
import { protect } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get Notifications
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "from",
        select: "name email",
      })
      .populate({
        path: "post",
        select: "text",
      });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete All Notifications
router.delete("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Single Notification
router.delete("/:id", protect, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not allowed to delete this notification" });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotification: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;