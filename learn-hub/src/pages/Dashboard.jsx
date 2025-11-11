import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
      <p className="mb-4">Role: {user.role}</p>

      <h2 className="text-2xl font-semibold mb-2">Your Courses</h2>
      {user.enrolledCourses?.length ? (
        <ul>
          {user.enrolledCourses.map((course) => (
            <li key={course._id} className="mb-2">
              {course.title} - ${course.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't enrolled in any courses yet.</p>
      )}
    </div>
  );
};

export default Dashboard;