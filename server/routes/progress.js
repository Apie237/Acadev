import express from "express";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get user's progress for a specific course
router.get("/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Find progress
    let progress = await Progress.findOne({
      user: req.user._id,
      course: courseId,
    });

    // If no progress exists, create a default one
    if (!progress) {
      progress = {
        user: req.user._id,
        course: courseId,
        completedLessons: [],
        progressPercentage: 0,
      };
    }

    console.log(`📊 Progress for user ${req.user._id} in course ${courseId}:`, {
      completedLessons: progress.completedLessons,
      percentage: progress.progressPercentage
    });

    res.json(progress);
  } catch (error) {
    console.error("❌ Error fetching progress:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Mark a lesson as completed
router.post("/:courseId/complete/:lessonId", protect, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    
    // Fetch course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if lesson exists in course
    const lessonExists = course.lessons.some(
      lesson => lesson._id.toString() === lessonId
    );
    
    if (!lessonExists) {
      return res.status(404).json({ message: "Lesson not found in this course" });
    }

    const totalLessons = course.lessons.length;
    
    // Find or create progress
    let progress = await Progress.findOne({ 
      user: req.user._id, 
      course: courseId 
    });

    if (!progress) {
      // Create new progress record
      progress = await Progress.create({
        user: req.user._id,
        course: courseId,
        completedLessons: [lessonId],
        progressPercentage: Math.round((1 / totalLessons) * 100),
      });
      
      console.log(`✅ Created new progress for user ${req.user._id}:`, {
        completedCount: 1,
        totalLessons,
        percentage: progress.progressPercentage
      });
    } else {
      // Check if lesson is already completed
      const isAlreadyCompleted = progress.completedLessons.some(
        id => id.toString() === lessonId
      );

      if (isAlreadyCompleted) {
        console.log(`⚠️ Lesson ${lessonId} already completed`);
        return res.json(progress);
      }

      // Add lesson to completed list
      progress.completedLessons.push(lessonId);
      
      // Calculate new percentage - rounded to avoid floating point issues
      const newPercentage = Math.round(
        (progress.completedLessons.length / totalLessons) * 100
      );
      
      progress.progressPercentage = newPercentage;
      await progress.save();

      console.log(`✅ Updated progress for user ${req.user._id}:`, {
        completedCount: progress.completedLessons.length,
        totalLessons,
        percentage: progress.progressPercentage
      });
    }

    res.json(progress);
  } catch (error) {
    console.error("❌ Error marking lesson complete:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ NEW: Unmark a lesson (optional - for when users want to review)
router.delete("/:courseId/complete/:lessonId", protect, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    
    const progress = await Progress.findOne({ 
      user: req.user._id, 
      course: courseId 
    });

    if (!progress) {
      return res.status(404).json({ message: "No progress found" });
    }

    // Remove lesson from completed list
    progress.completedLessons = progress.completedLessons.filter(
      id => id.toString() !== lessonId
    );

    // Recalculate percentage
    const course = await Course.findById(courseId);
    if (course) {
      progress.progressPercentage = Math.round(
        (progress.completedLessons.length / course.lessons.length) * 100
      );
    }

    await progress.save();

    console.log(`🔄 Unmarked lesson ${lessonId}:`, {
      completedCount: progress.completedLessons.length,
      percentage: progress.progressPercentage
    });

    res.json(progress);
  } catch (error) {
    console.error("❌ Error unmarking lesson:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ NEW: Reset course progress (optional - for starting over)
router.delete("/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const result = await Progress.findOneAndDelete({
      user: req.user._id,
      course: courseId
    });

    if (!result) {
      return res.status(404).json({ message: "No progress found to reset" });
    }

    console.log(`🔄 Reset progress for user ${req.user._id} in course ${courseId}`);

    res.json({ 
      message: "Progress reset successfully",
      completedLessons: [],
      progressPercentage: 0
    });
  } catch (error) {
    console.error("❌ Error resetting progress:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ NEW: Get progress for all enrolled courses (useful for dashboard)
router.get("/", protect, async (req, res) => {
  try {
    const allProgress = await Progress.find({ user: req.user._id })
      .populate('course', 'title thumbnail lessons');

    console.log(`📊 All progress for user ${req.user._id}:`, allProgress.length);

    res.json(allProgress);
  } catch (error) {
    console.error("❌ Error fetching all progress:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;