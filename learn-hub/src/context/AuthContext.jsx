import { createContext, useEffect, useState } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Update a specific course's progress in user.enrolledCourses
  const updateCourseProgress = (courseId, progressPercentage) => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      enrolledCourses: prev.enrolledCourses.map((course) =>
        course._id === courseId
          ? { ...course, progressPercentage }
          : course
      ),
    }));
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <AuthContext.Provider value={{ user, setUser, updateCourseProgress }}>
      {children}
    </AuthContext.Provider>
  );
};
