import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function ProgressPage() {
  const { user } = useContext(AuthContext);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch all enrolled courses
        const res = await api.get(`/users/${user._id}/enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const courses = res.data;

        // ✅ For each course, get progress
        const progressDetails = await Promise.all(
          courses.map(async (course) => {
            const progressRes = await api.get(`/progress/${course._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const progress = progressRes.data || { completedLessons: [], progressPercentage: 0 };
            const completedCount = progress.completedLessons?.length || 0;
            const totalLessons = course.lessons?.length || 0;

            return {
              ...course,
              progressPercentage: progress.progressPercentage,
              completedLessons: completedCount,
              totalLessons,
            };
          })
        );

        setProgressData(progressDetails);
      } catch (error) {
        console.error("❌ Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (loading) return <p className="p-6">Loading your progress...</p>;

  if (progressData.length === 0)
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">You haven’t started any courses yet.</p>
        <Link
          to="/"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Browse Courses
        </Link>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Learning Progress</h2>

      <div className="space-y-6">
        {progressData.map((course) => (
          <div
            key={course._id}
            className="border rounded-xl shadow-sm bg-white p-4 hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <img
                src={course.thumbnail || "https://via.placeholder.com/200x120"}
                alt={course.title}
                className="w-full md:w-48 h-28 object-cover rounded-md"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.category}</p>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{ width: `${course.progressPercentage || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.round(course.progressPercentage || 0)}% complete —{" "}
                    {course.completedLessons}/{course.totalLessons} lessons done
                  </p>
                </div>

                {/* Continue Button */}
                <Link
                  to={`/courses/${course._id}`}
                  className="inline-block bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                >
                  Continue Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
