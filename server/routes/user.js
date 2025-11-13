// user.js
import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";

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
    // Ensure the user can only access their own data
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.params.id).populate("enrolledCourses");

    if (!user) return res.status(404).json({ message: "User not found" });

    const coursesWithProgress = await Promise.all(
      user.enrolledCourses.map(async (course) => {
        const progress = await Progress.findOne({
          user: req.user._id,
          course: course._id,
        });

        const totalLessons = course.lessons.length;
        const completedLessons = progress?.completedLessons.length || 0;
        const progressPercentage = totalLessons
          ? (completedLessons / totalLessons) * 100
          : 0;

        return {
          ...course.toObject(),
          progressPercentage,
        };
      })
    );

    res.json(coursesWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin route to get all users
router.get("/admin/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only" });

    const users = await User.find().populate("enrolledCourses");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
