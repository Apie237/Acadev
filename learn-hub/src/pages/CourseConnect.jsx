import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import BeaconChat from "../components/BeaconChat";
import ChannelSidebar from "../components/ChannelSidebar";
import GeneralFeed from "../components/GeneralFeed";
import CourseFeed from "../components/CourseFeed";
import ChannelSidebarSkeleton from "../components/skeletons/ChannelSidebarSkeleton";
import GeneralFeedSkeleton from "../components/skeletons/GeneralFeedSkeleton";
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
      <div className="flex h-screen bg-[#E6E5E1] relative">
        <ChannelSidebarSkeleton />
        <div className="flex-1 overflow-y-auto relative">
          <GeneralFeedSkeleton />
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