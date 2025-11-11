import { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyCourses() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/users/${user._id}/enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) return <p>Loading your courses...</p>;

  if (courses.length === 0)
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">You haven’t enrolled in any courses yet.</p>
        <Link
          to="http://localhost:5173/" // client homepage
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Browse Courses
        </Link>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="border rounded-xl shadow-md hover:shadow-lg transition p-4 bg-white"
          >
            <img
              src={course.thumbnail || "https://via.placeholder.com/300x200"}
              alt={course.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold text-lg">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{course.category}</p>
            <Link
              to={`/lessons?course=${course._id}`}
              className="inline-block bg-green-600 text-white px-3 py-2 rounded-md text-sm"
            >
              Continue Learning
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
