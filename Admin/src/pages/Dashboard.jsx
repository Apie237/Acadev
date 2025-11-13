import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch data in parallel
        const [coursesRes, usersRes] = await Promise.all([
          api.get("/courses", { headers }),
          api.get("/users/admin/all", { headers }),
        ]);

        const totalCourses = coursesRes.data.length;
        const totalUsers = usersRes.data.length;

        // Count total enrollments across all users
        const totalEnrollments = usersRes.data.reduce(
          (acc, user) => acc + (user.enrolledCourses?.length || 0),
          0
        );

        setStats({ totalCourses, totalUsers, totalEnrollments });
      } catch (err) {
        console.error("❌ Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-700">Total Courses</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalCourses}</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-blue-600">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-yellow-500">
          <h2 className="text-lg font-semibold text-gray-700">Total Enrollments</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalEnrollments}</p>
        </div>
      </div>
    </div>
  );
}
