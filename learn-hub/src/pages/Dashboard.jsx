import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import {
  BookOpen,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import api from "../utils/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Stats calculations
  const totalEnrolled = enrolledCourses.length;
  const inProgress = enrolledCourses.filter(c => {
    const progress = c.progressPercentage || 0;
    return progress > 0 && progress < 100;
  }).length;
  const completed = enrolledCourses.filter(c => (c.progressPercentage || 0) >= 100).length;
  const notStarted = enrolledCourses.filter(c => !c.progressPercentage || c.progressPercentage === 0).length;

  const overallProgress = totalEnrolled > 0
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progressPercentage || 0), 0) / totalEnrolled)
    : 0;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get(`/users/${user._id}/enrolled`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("📊 Enrolled courses with progress:", res.data);
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("❌ Error fetching enrolled courses:", err);
        setError(err.response?.data?.message || "Failed to load courses");

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user, navigate]);

  // Calendar helpers
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const today = new Date().getDate();
  const isCurrentMonth = currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (!user) return null;

  if (loading) {
    return <DashboardSkeleton/>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-6 py-2 rounded-xl hover:shadow-lg transition-all text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6E5E1] p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2d6b66] mb-1">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 flex items-center gap-2">
            <span>👋</span>
            Welcome back, <span className="font-semibold">{user.name}</span>!
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-4">
          
          {/* Left Column - Stats and Courses */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Stats Cards - 4 compact boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Enrolled", value: totalEnrolled, icon: BookOpen, gradient: "from-blue-500 to-blue-600" },
                { label: "In Progress", value: inProgress, icon: TrendingUp, gradient: "from-amber-500 to-orange-600" },
                { label: "Completed", value: completed, icon: CheckCircle, gradient: "from-emerald-500 to-green-600" },
                { label: "Not Started", value: notStarted, icon: Clock, gradient: "from-purple-500 to-purple-600" },
              ].map((card, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-all border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                      <card.icon className="text-white" size={16} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#2d6b66] mb-0.5">{card.value}</h3>
                  <p className="text-[10px] text-gray-500 font-medium">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Enrolled Courses Section */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#2d6b66]">My Courses</h2>
                {enrolledCourses.length > 3 && (
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="text-sm text-[#409891] font-semibold hover:text-[#2d6b66] transition-colors"
                  >
                    View All →
                  </button>
                )}
              </div>

              {enrolledCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {enrolledCourses.slice(0, 4).map((course) => {
                    const progress = Math.round(course.progressPercentage || 0);

                    return (
                      <div
                        key={course._id}
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all border border-gray-200 hover:border-[#409891] group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <BookOpen className="text-white" size={20} />
                          </div>
                          <span className="text-xs font-bold text-[#409891] bg-[#409891]/10 px-2.5 py-1 rounded-full">
                            {progress}%
                          </span>
                        </div>

                        <h3 className="font-bold text-[#2d6b66] text-base mb-2 line-clamp-2 group-hover:text-[#409891] transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#409891] to-[#48ADB7] rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">
                            {course.lessons?.length || 0} Lessons
                          </span>
                          <button className="text-[#409891] font-bold hover:text-[#2d6b66] transition-colors">
                            {progress === 0 ? "Start" : progress === 100 ? "Review" : "Continue"} →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#409891]/20 to-[#48ADB7]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} className="text-[#409891]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2d6b66] mb-2">No Courses Yet</h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
                    Start your learning journey by enrolling in a course today!
                  </p>
                  <button
                    onClick={() => navigate("/courses")}
                    className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all text-sm inline-flex items-center gap-2"
                  >
                    <BookOpen size={16} />
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Progress and Calendar */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#2d6b66]">Overall Progress</h3>
                <span className="text-xs text-gray-500">{totalEnrolled} courses</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                    <circle
                      cx="64" cy="64" r="56"
                      stroke="url(#gradient)"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallProgress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#409891" />
                        <stop offset="100%" stopColor="#48ADB7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-[#2d6b66]">{overallProgress}%</span>
                    <span className="text-xs text-gray-500">Complete</span>
                  </div>
                </div>
                
                {totalEnrolled === 0 ? (
                  <p className="text-xs text-gray-500 text-center">Enroll in courses to track progress</p>
                ) : (
                  <div className="w-full grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl font-bold text-emerald-600">{completed}</div>
                      <div className="text-[10px] text-gray-500">Completed</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-amber-600">{inProgress}</div>
                      <div className="text-[10px] text-gray-500">In Progress</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-600">{notStarted}</div>
                      <div className="text-[10px] text-gray-500">Not Started</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#2d6b66]">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <div className="flex gap-1">
                  <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ChevronLeft size={16} className="text-[#409891]" />
                  </button>
                  <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ChevronRight size={16} className="text-[#409891]" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-bold text-gray-500 pb-1">{d}</div>
                ))}

                {[...Array(startingDayOfWeek)].map((_, i) => (<div key={`empty-${i}`} />))}

                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const isToday = isCurrentMonth && day === today;
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all
                        ${isToday
                            ? 'bg-gradient-to-br from-[#409891] to-[#48ADB7] text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;