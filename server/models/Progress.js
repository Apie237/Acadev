import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: String }], // store lesson _id or title
    progressPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
