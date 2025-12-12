import { Hash, Globe, BookOpen, ChevronLeft, ChevronRight, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChannelSidebar = ({
  enrolledCourses,
  selectedCourse,
  setSelectedCourse,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
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
          onClick={() => navigate("/dashboard")}
          title={!sidebarOpen ? "Back to Dashboard" : ""}
          className={`flex items-center w-full ${
            sidebarOpen ? "gap-3 px-3" : "justify-center"
          } py-2 rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-[#BAD0CC]/20`}
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
          className={`flex items-center ${
            sidebarOpen ? "gap-3 px-3" : "justify-center"
          } py-2 rounded-lg cursor-pointer transition-all ${
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
              title={!sidebarOpen ? course.title : ""}
              className={`flex items-center ${
                sidebarOpen ? "gap-3 px-3" : "justify-center"
              } py-2 rounded-lg cursor-pointer transition-all group ${
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
          className={`flex items-center w-full ${
            sidebarOpen ? "gap-3 px-3" : "justify-center"
          } py-2 rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-red-50 hover:text-red-600`}
        >
          <LogOut size={18} />
          {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default ChannelSidebar;