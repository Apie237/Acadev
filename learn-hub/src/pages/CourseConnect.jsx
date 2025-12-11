import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MessageCircle, Users, BookOpen, TrendingUp, ChevronRight, Hash, Globe, ChevronLeft, LogOut, Home } from "lucide-react";
import api from "../utils/api";
import BeaconChat from "../components/BeaconChat";

export default function CourseConnect({ onLogout }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await api.get(`/users/${user._id}/enrolled`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#409891] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-lg font-semibold text-[#2d6b66]">Loading CourseConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#E6E5E1] relative">
      {/* CourseConnect Sidebar - Separate from main sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white border-r border-[#BAD0CC]/30 h-screen transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#BAD0CC]/30">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-lg flex items-center justify-center">
                    <Hash className="text-white" size={16} />
                  </div>
                  <h2 className="font-bold text-lg text-[#2d6b66]">Channels</h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 hover:bg-[#BAD0CC]/20 rounded-lg transition-all"
                >
                  <ChevronLeft className="text-[#409891]" size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex justify-center p-1.5 hover:bg-[#BAD0CC]/20 rounded-lg transition-all"
              >
                <ChevronRight className="text-[#409891]" size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="p-3 border-b border-[#BAD0CC]/30">
          <button
            onClick={() => navigate('/dashboard')}
            title={!sidebarOpen ? "Back to Dashboard" : ""}
            className={`flex items-center w-full ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-[#BAD0CC]/20`}
          >
            <Home size={18} />
            {sidebarOpen && <span className="font-medium text-sm">Back to Dashboard</span>}
          </button>
        </div>

        {/* General Channel */}
        <div className="p-3">
          <div
            onClick={() => setSelectedCourse(null)}
            title={!sidebarOpen ? "General" : ""}
            className={`flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg cursor-pointer transition-all ${
              selectedCourse === null
                ? "bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white"
                : "text-gray-700 hover:bg-[#BAD0CC]/20"
            }`}
          >
            <Globe size={18} />
            {sidebarOpen && <span className="font-medium text-sm">General</span>}
          </div>
        </div>

        {/* Course Channels */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {sidebarOpen && (
            <div className="mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide px-3 py-2">
                Course Channels
              </p>
            </div>
          )}
          <div className="space-y-1">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => setSelectedCourse(course._id)}
                title={!sidebarOpen ? course.title : ''}
                className={`flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg cursor-pointer transition-all group ${
                  selectedCourse === course._id
                    ? "bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white"
                    : "text-gray-700 hover:bg-[#BAD0CC]/20"
                }`}
              >
                <Hash size={16} className={selectedCourse === course._id ? "" : "text-gray-400"} />
                {sidebarOpen && <span className="font-medium text-sm line-clamp-1">{course.title}</span>}
              </div>
            ))}
          </div>

          {enrolledCourses.length === 0 && sidebarOpen && (
            <div className="text-center py-8 px-4">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-xs text-gray-500">No courses enrolled yet</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-[#BAD0CC]/30 mt-auto">
          <button
            onClick={onLogout}
            title={!sidebarOpen ? "Logout" : ""}
            className={`flex items-center w-full ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-red-50 hover:text-red-600`}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        {selectedCourse ? (
          <CourseFeed courseId={selectedCourse} />
        ) : (
          <div className="min-h-screen bg-[#E6E5E1] p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2d6b66] mb-2">Welcome to CourseConnect</h1>
                <p className="text-gray-600">Connect with fellow learners in your courses</p>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-xl flex items-center justify-center">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Courses</p>
                      <p className="text-2xl font-bold text-[#2d6b66]">{enrolledCourses.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fellow Students</p>
                      <p className="text-2xl font-bold text-[#2d6b66]">-</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <MessageCircle className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Posts</p>
                      <p className="text-2xl font-bold text-[#2d6b66]">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses Overview */}
              {enrolledCourses.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-[#2d6b66] mb-4">Your Course Communities</h2>
                  <div className="space-y-3">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course._id}
                        onClick={() => setSelectedCourse(course._id)}
                        className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg cursor-pointer hover:shadow-md transition-all border border-gray-200 hover:border-[#409891] group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen className="text-white" size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#2d6b66] group-hover:text-[#409891] transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600">{course.category}</p>
                          </div>
                        </div>
                        <ChevronRight className="text-[#409891] group-hover:translate-x-2 transition-transform" size={20} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <div className="w-20 h-20 bg-[#BAD0CC]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={40} className="text-[#409891]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2d6b66] mb-2">No Courses Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Enroll in courses to start connecting with fellow learners!
                  </p>
                  <button
                    onClick={() => window.location.href = "http://localhost:5173/courses"}
                    className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* BeaconChat */}
      <BeaconChat />
    </div>
  );
}

// Placeholder for Course Feed Component
function CourseFeed({ courseId }) {
  return (
    <div className="min-h-screen bg-[#E6E5E1] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <MessageCircle className="w-16 h-16 text-[#409891] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2d6b66] mb-2">Course Feed</h2>
          <p className="text-gray-600">Post feed for this course will appear here</p>
        </div>
      </div>
    </div>
  );
}