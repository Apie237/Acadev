import { useState } from "react";
import api from "../utils/api";

export default function AddCourse() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    thumbnail: "",
    lessons: [], // ✅ new
  });

  const [lesson, setLesson] = useState({ title: "", content: "", videoUrl: "", duration: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLessonChange = (e) =>
    setLesson({ ...lesson, [e.target.name]: e.target.value });

  const addLesson = () => {
    if (!lesson.title || !lesson.content) return;
    setFormData({ ...formData, lessons: [...formData.lessons, lesson] });
    setLesson({ title: "", content: "", videoUrl: "", duration: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      await api.post("/courses", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Course created successfully!");
      setFormData({ title: "", category: "", description: "", price: "", thumbnail: "", lessons: [] });
    } catch (err) {
      console.error("❌ Error creating course:", err);
      setMessage("Error creating course. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Course</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "category", "price", "thumbnail"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        ))}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        {/* Lessons Section */}
        <div className="border p-4 rounded-md space-y-2">
          <h3 className="font-semibold">Add Lesson</h3>
          <input
            type="text"
            name="title"
            placeholder="Lesson Title"
            value={lesson.title}
            onChange={handleLessonChange}
            className="w-full border px-3 py-2 rounded-md"
          />
          <textarea
            name="content"
            placeholder="Lesson Content"
            value={lesson.content}
            onChange={handleLessonChange}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            name="videoUrl"
            placeholder="Video URL (optional)"
            value={lesson.videoUrl}
            onChange={handleLessonChange}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration in minutes"
            value={lesson.duration}
            onChange={handleLessonChange}
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            type="button"
            onClick={addLesson}
            className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
          >
            Add Lesson
          </button>
        </div>

        {/* List of added lessons */}
        {formData.lessons.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Lessons Preview:</h3>
            <ul className="list-disc list-inside">
              {formData.lessons.map((l, index) => (
                <li key={index}>
                  <strong>{l.title}</strong> - {l.duration || "0"} min
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md mt-4"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
