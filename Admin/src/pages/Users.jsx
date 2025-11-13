// src/pages/Users.jsx
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/admin/all");
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="p-6">Loading users...</p>;

  if (users.length === 0)
    return <p className="p-6">No users found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="border rounded-lg shadow-sm p-4 bg-white"
          >
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <p className="text-sm mb-2">
              Role: <span className="font-medium">{user.role}</span>
            </p>
            <p className="text-sm font-medium mb-2">Enrolled Courses:</p>
            {user.enrolledCourses.length > 0 ? (
              <ul className="list-disc ml-5 text-sm text-gray-700">
                {user.enrolledCourses.map((course) => (
                  <li key={course._id}>{course.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No courses enrolled</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
