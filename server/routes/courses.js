import express from "express";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = express.Router();

// ✅ Get all published courses (Public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ published: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get single course (Public)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create course (Admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    // Remove lesson _ids if any were accidentally sent
    if (req.body.lessons && Array.isArray(req.body.lessons)) {
      req.body.lessons = req.body.lessons.map(({ _id, ...lesson }) => lesson);
    }

    const course = await Course.create(req.body);
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update course (Admin)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    // Also clean lesson _ids if updating
    if (req.body.lessons && Array.isArray(req.body.lessons)) {
      req.body.lessons = req.body.lessons.map(({ _id, ...lesson }) => lesson);
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete course (Admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Add new lesson to existing course (Admin)
router.post("/:id/lessons", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { _id, ...lessonData } = req.body;
    course.lessons.push(lessonData);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
