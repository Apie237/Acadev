import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
    duration: { type: Number },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    published: { type: Boolean, default: false },
    lessons: [lessonSchema],
    thumbnail: { type: String },
    duration: { type: Number }, 
    features: [{ type: String }], 
    imageUrl: { type: String }, 
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;