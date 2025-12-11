import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import TokenHandler from "./components/TokenHandler";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import LessonPlayer from "./pages/LessonPlayer";
import MyProgress from "./pages/MyProgress";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BeaconChat from "./components/BeaconChat";
import CourseConnect from "./pages/CourseConnect";

// Layout wrapper for authenticated routes
function AuthenticatedLayout({ children, onLogout, sidebarOpen, setSidebarOpen }) {
  return (
    <div className="flex min-h-screen bg-[#E6E5E1]">
      <Sidebar onLogout={onLogout} open={sidebarOpen} setOpen={setSidebarOpen} />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'
          } min-h-screen relative`}
      >
        {children}
        <BeaconChat />
      </main>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <TokenHandler />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Protected routes with layout */}
        <Route path="/dashboard" element={
          <AuthenticatedLayout onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Dashboard />
          </AuthenticatedLayout>
        } />

        <Route path="/my-courses" element={
          <AuthenticatedLayout onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <MyCourses />
          </AuthenticatedLayout>
        } />

        <Route path="/courses/:courseId" element={
          <AuthenticatedLayout onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <LessonPlayer />
          </AuthenticatedLayout>
        } />

        <Route path="/progress" element={
          <AuthenticatedLayout onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <MyProgress />
          </AuthenticatedLayout>
        } />

        {/* CourseConnect with its OWN sidebar - NO AuthenticatedLayout wrapper */}
        <Route 
          path="/course-connect" 
          element={user ? <CourseConnect onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        <Route path="/settings" element={
          <AuthenticatedLayout onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#2d6b66] mb-2">Settings</h2>
                  <p className="text-gray-600">Settings page coming soon...</p>
                </div>
              </div>
            </div>
          </AuthenticatedLayout>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}