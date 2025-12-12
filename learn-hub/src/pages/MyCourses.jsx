import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Clock, TrendingUp, Filter, Search, AlertCircle } from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import MyCoursesSkeleton from "../components/skeletons/MyCoursesSkeleton";

export default function MyCourses() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch enrolled courses with progress already calculated
        const res = await api.get(`/users/${user._id}/enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📚 Enrolled courses:", res.data);
        setCourses(res.data);
        setFilteredCourses(res.data);
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

    fetchCourses();
  }, [user, navigate]);

  // Filter courses based on search and status
  useEffect(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((course) => {
        const progress = course.progressPercentage || 0;
        if (filterStatus === "not-started") return progress === 0;
        if (filterStatus === "in-progress") return progress > 0 && progress < 100;
        if (filterStatus === "completed") return progress === 100;
        return true;
      });
    }

    setFilteredCourses(filtered);
  }, [searchTerm, filterStatus, courses]);

  // Stats
  const totalCourses = courses.length;
  const inProgress = courses.filter(c => {
    const p = c.progressPercentage || 0;
    return p > 0 && p < 100;
  }).length;
  const completed = courses.filter(c => (c.progressPercentage || 0) === 100).length;
  const notStarted = courses.filter(c => !c.progressPercentage || c.progressPercentage === 0).length;

  if (loading) {
    return (
      <MyCoursesSkeleton/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Courses</h3>
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

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#2d6b66] mb-6">My Courses</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-[#BAD0CC]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={40} className="text-[#409891]" />
            </div>
            <h3 className="text-2xl font-bold text-[#2d6b66] mb-2">No Courses Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Start your learning journey by exploring our course catalog!
            </p>
            <button
              onClick={() => window.location.href =  "https://acadevo.vercel.app/courses"}
              className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6E5E1] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2d6b66] mb-1">My Courses</h1>
          <p className="text-sm text-gray-600">Track your learning progress</p>
        </div>

        {/* Stats Cards - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#409891]/10 rounded-lg flex items-center justify-center">
                <BookOpen className="text-[#409891]" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-2xl font-bold text-[#2d6b66]">{totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#48ADB7]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-[#48ADB7]" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-[#2d6b66]">{inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00d9a3]/10 rounded-lg flex items-center justify-center">
                <BookOpen className="text-[#00d9a3]" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-[#2d6b66]">{completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#BAD0CC]/30 rounded-lg flex items-center justify-center">
                <Clock className="text-[#409891]" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Not Started</p>
                <p className="text-2xl font-bold text-[#2d6b66]">{notStarted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-[#BAD0CC] rounded-lg focus:border-[#409891] focus:outline-none text-sm"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-600" size={18} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-[#BAD0CC] rounded-lg focus:border-[#409891] focus:outline-none text-sm font-medium text-[#2d6b66]"
              >
                <option value="all">All Courses</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm || filterStatus !== "all" ? (
          <p className="text-sm text-gray-600 mb-4">
            Showing <span className="font-bold text-[#409891]">{filteredCourses.length}</span> of {totalCourses} courses
          </p>
        ) : null}

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const progress = Math.round(course.progressPercentage || 0);
              const status = progress === 0 ? "Not Started" : progress === 100 ? "Completed" : "In Progress";
              const statusColor = progress === 0 ? "text-gray-500" : progress === 100 ? "text-green-600" : "text-[#48ADB7]";

              return (
                <div
                  key={course._id}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-[#BAD0CC]/30"
                >
                  {/* Course Image */}
                  <div className="relative h-40 bg-gradient-to-br from-[#409891] to-[#48ADB7]">
                    {course.thumbnail || course.imageUrl ? (
                      <img
                        src={course.thumbnail || course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={40} className="text-white opacity-50" />
                      </div>
                    )}
                    
                    {/* Progress Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-white text-[#409891] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {progress}%
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-4">
                    {/* Category */}
                    {course.category && (
                      <span className="inline-block text-xs font-semibold text-[#409891] bg-[#BAD0CC]/30 px-2 py-1 rounded-full mb-2">
                        {course.category}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-[#2d6b66] text-base mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Description */}
                    {course.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-semibold ${statusColor}`}>{status}</span>
                        <span className="text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#BAD0CC]/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#409891] to-[#48ADB7] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#BAD0CC]/30">
                      <span className="text-xs text-gray-600">
                        {course.lessons?.length || 0} Lessons
                      </span>
                      <button className="text-sm font-bold text-[#409891] hover:text-[#2d6b66] transition-colors">
                        {progress === 0 ? "Start" : progress === 100 ? "Review" : "Continue"} →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-[#BAD0CC]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-[#409891]" />
            </div>
            <h3 className="text-xl font-bold text-[#2d6b66] mb-2">No Courses Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-6 py-2 rounded-xl hover:shadow-lg transition-all text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}