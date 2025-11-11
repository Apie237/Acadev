import express from 'express';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Admin: add lesson to course
router.post('/:courseId', protect, adminOnly, async (req, res) => {
  const { title, content, videoUrl } = req.body;
  const lesson = await Lesson.create({ title, content, videoUrl, course: req.params.courseId });
  await Course.findByIdAndUpdate(req.params.courseId, { $push: { lessons: lesson._id } });
  res.json(lesson);
});

// Student: view lesson content
router.get('/:lessonId', protect, async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  res.json(lesson);
});

export default router;
