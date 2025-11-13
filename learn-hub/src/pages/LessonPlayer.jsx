import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function LessonPlayer() {
  const { courseId } = useParams();
  const { user, updateCourseProgress } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/progress/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCourse(courseRes.data);
        setProgress(progressRes.data);

        const firstIncompleteIndex = courseRes.data.lessons.findIndex(
          (lesson) => !progressRes.data.completedLessons.includes(lesson._id)
        );
        setCurrentLessonIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
      } catch (err) {
        console.error("❌ Error fetching course or progress:", err);
      }
    };
    fetchData();
  }, [courseId]);

  const markLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/progress/${courseId}/complete/${lessonId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(res.data);

      // ✅ Update MyCourses progress immediately
      updateCourseProgress(courseId, res.data.progressPercentage);
    } catch (err) {
      console.error("❌ Error marking lesson complete:", err);
    }
  };

  if (!course) return <p className="p-6">Loading course...</p>;

  const lesson = course.lessons[currentLessonIndex];
  const isDone = progress?.completedLessons?.includes(lesson._id);

  const goPrev = () => {
    if (currentLessonIndex > 0) setCurrentLessonIndex(currentLessonIndex - 1);
  };

  const goNext = () => {
    if (currentLessonIndex < course.lessons.length - 1)
      setCurrentLessonIndex(currentLessonIndex + 1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{course.title}</h1>

      <div className="border rounded-md p-6 mb-6 bg-white shadow-sm">
        <h2 className="font-semibold text-xl mb-3">{lesson.title}</h2>
        <p className="text-gray-700 mb-4 whitespace-pre-line">{lesson.content}</p>
        {lesson.videoUrl && (
          <video src={lesson.videoUrl} controls className="w-full rounded mb-4" />
        )}
        <button
          onClick={() => markLessonComplete(lesson._id)}
          disabled={isDone}
          className={`w-full px-4 py-2 rounded text-white ${
            isDone ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isDone ? "Completed ✅" : "Mark as Done"}
        </button>
        <div className="flex justify-between mt-4">
          <button
            onClick={goPrev}
            disabled={currentLessonIndex === 0}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={currentLessonIndex === course.lessons.length - 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-8">
        <p className="font-medium mb-2">
          Overall Progress: {Math.round(progress?.progressPercentage || 0)}%
        </p>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-green-500 h-3 rounded"
            style={{ width: `${progress?.progressPercentage || 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
