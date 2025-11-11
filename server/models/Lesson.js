import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String, // HTML (from Quill)
  videoUrl: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
});

export default mongoose.model('Lesson', LessonSchema);
