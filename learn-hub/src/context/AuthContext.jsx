import { createContext, useEffect, useState } from "react";
import api from "../utils/api";
import AcadevoLoader from "../components/AcadevoLoader";

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
      .then((res) => {
        console.log("✅ User fetched in AuthContext:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch user:", err.response?.data || err.message);
        // Clear invalid token
        localStorage.removeItem("token");
        setUser(null);
      })
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

  if (loading) return <AcadevoLoader/>

  return (
    <AuthContext.Provider value={{ user, setUser, updateCourseProgress }}>
      {children}
    </AuthContext.Provider>
  );
};