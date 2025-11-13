import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Courses</h2>
        <Link
          to="/courses/new"
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          + Add New Course
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
          >
            <img
              src={course.thumbnail || "https://via.placeholder.com/300x200"}
              alt={course.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
