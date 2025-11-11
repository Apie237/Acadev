// user.js
import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

const router = express.Router();

// Get current user with populated enrolledCourses
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/enrolled", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("enrolledCourses");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.enrolledCourses);
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
