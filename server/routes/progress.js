import express from 'express';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Mark lesson complete
router.post('/complete/:lessonId', protect, async (req, res) => {
  const { courseId } = req.body;
  const { lessonId } = req.params;
  let progress = await Progress.findOne({ user: req.user._id, course: courseId });
  if (!progress) progress = await Progress.create({ user: req.user._id, course: courseId, completedLessons: [] });
  if (!progress.completedLessons.includes(lessonId)) progress.completedLessons.push(lessonId);
  await progress.save();
  res.json(progress);
});

export default router;
