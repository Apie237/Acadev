import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import LessonPlayer from "./pages/LessonPlayer";
import MyProgress from "./pages/MyProgress";

export default function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/courses/:courseId" element={<LessonPlayer />} />
          <Route path="/progress" element={<MyProgress />} />
          <Route path="/settings" element={<p>Settings page coming soon...</p>} />
        </Routes>
      </main>
    </div>
  );
}
