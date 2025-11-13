import express from "express";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get user's progress for a specific course
router.get("/:courseId", protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    res.json(progress || { completedLessons: [], progressPercentage: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Mark a lesson as completed
router.post("/:courseId/complete/:lessonId", protect, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: courseId,
        completedLessons: [lessonId],
        progressPercentage: (1 / course.lessons.length) * 100,
      });
    } else {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        progress.progressPercentage =
          (progress.completedLessons.length / course.lessons.length) * 100;
        await progress.save();
      }
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
