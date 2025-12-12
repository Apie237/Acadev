import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import BeaconChat from "../components/BeaconChat";
import ChannelSidebar from "../components/ChannelSidebar";
import GeneralFeed from "../components/GeneralFeed";
import CourseFeed from "../components/CourseFeed";

const CourseConnect = ({ onLogout }) => {
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
          headers: { Authorization: `Bearer ${token}` },
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
      {/* Channel Sidebar */}
      <ChannelSidebar
        enrolledCourses={enrolledCourses}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        {selectedCourse ? (
          <CourseFeed courseId={selectedCourse} />
        ) : (
          <GeneralFeed enrolledCourses={enrolledCourses} setSelectedCourse={setSelectedCourse} />
        )}
      </div>

      {/* BeaconChat */}
      <BeaconChat />
    </div>
  );
};

export default CourseConnect;