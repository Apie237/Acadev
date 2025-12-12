import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressSkeleton from "../components/skeletons/ProgressSkeleton";
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function ProgressPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProgress = async () => {
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

        const coursesWithProgress = res.data.map(course => ({
          ...course,
          completedLessons: course.completedLessons || 0,
          totalLessons: course.lessons?.length || 0,
          progressPercentage: course.progressPercentage || 0
        }));

        console.log("📊 Progress data:", coursesWithProgress);
        setProgressData(coursesWithProgress);
      } catch (error) {
        console.error("❌ Error fetching progress:", error);
        setError(error.response?.data?.message || "Failed to load progress");
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, navigate]);

  // Calculate statistics
  const totalCourses = progressData.length;
  const completedCourses = progressData.filter(c => c.progressPercentage >= 100).length;
  const inProgressCourses = progressData.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100).length;
  const notStartedCourses = progressData.filter(c => c.progressPercentage === 0).length;
  const averageProgress = totalCourses > 0
    ? Math.round(progressData.reduce((sum, c) => sum + c.progressPercentage, 0) / totalCourses)
    : 0;

  if (loading) {
    return (
     <ProgressSkeleton/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Progress</h3>
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

  if (progressData.length === 0) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#2d6b66] mb-6">My Learning Progress</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-[#BAD0CC]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={40} className="text-[#409891]" />
            </div>
            <h3 className="text-2xl font-bold text-[#2d6b66] mb-2">No Progress Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't started any courses yet. Enroll in courses to track your learning progress!
            </p>
            <button
              onClick={() => window.location.href = "http://localhost:5173/courses"}
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
          <h1 className="text-2xl font-bold text-[#2d6b66] mb-1">My Learning Progress</h1>
          <p className="text-sm text-gray-600">Track your achievements and continue your journey</p>
        </div>

        {/* Stats Cards - Compact Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {/* Total Courses */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#409891]/10 rounded-lg flex items-center justify-center">
                <BookOpen className="text-[#409891]" size={16} />
              </div>
              <p className="text-xs text-gray-600 font-medium">Total</p>
            </div>
            <p className="text-2xl font-bold text-[#2d6b66]">{totalCourses}</p>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#48ADB7]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-[#48ADB7]" size={16} />
              </div>
              <p className="text-xs text-gray-600 font-medium">Active</p>
            </div>
            <p className="text-2xl font-bold text-[#2d6b66]">{inProgressCourses}</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#00d9a3]/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-[#00d9a3]" size={16} />
              </div>
              <p className="text-xs text-gray-600 font-medium">Done</p>
            </div>
            <p className="text-2xl font-bold text-[#2d6b66]">{completedCourses}</p>
          </div>

          {/* Not Started */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#BAD0CC]/30 rounded-lg flex items-center justify-center">
                <Clock className="text-[#409891]" size={16} />
              </div>
              <p className="text-xs text-gray-600 font-medium">Pending</p>
            </div>
            <p className="text-2xl font-bold text-[#2d6b66]">{notStartedCourses}</p>
          </div>

          {/* Average Progress */}
          <div className="bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-xl shadow p-4 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="text-white" size={16} />
              </div>
              <p className="text-xs text-white/90 font-medium">Avg Progress</p>
            </div>
            <p className="text-2xl font-bold text-white">{averageProgress}%</p>
          </div>
        </div>

        {/* Progress List */}
        <div className="space-y-4">
          {progressData.map((course) => {
            const progress = Math.round(course.progressPercentage || 0);
            const status = progress === 0 ? "Not Started" : progress >= 100 ? "Completed" : "In Progress";
            const statusColor = 
              progress === 0 ? "text-gray-500 bg-gray-100" :
              progress >= 100 ? "text-green-700 bg-green-100" :
              "text-[#48ADB7] bg-[#48ADB7]/10";

            return (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all border border-[#BAD0CC]/30 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Course Image */}
                  <div className="md:w-56 h-40 md:h-auto bg-gradient-to-br from-[#409891] to-[#48ADB7] flex-shrink-0">
                    {course.thumbnail || course.imageUrl ? (
                      <img
                        src={course.thumbnail || course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={48} className="text-white opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#2d6b66]">{course.title}</h3>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                            {status}
                          </span>
                        </div>
                        {course.category && (
                          <span className="text-xs font-medium text-gray-600 bg-[#BAD0CC]/30 px-2 py-1 rounded">
                            {course.category}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-3xl font-bold text-[#409891]">{progress}%</div>
                        <p className="text-xs text-gray-500">Complete</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span className="font-medium">
                          {course.completedLessons || 0} of {course.totalLessons} lessons completed
                        </span>
                        {progress >= 100 && (
                          <span className="flex items-center gap-1 text-green-600 font-semibold">
                            <Award size={14} />
                            Finished!
                          </span>
                        )}
                      </div>
                      <div className="w-full h-3 bg-[#BAD0CC]/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#409891] to-[#48ADB7] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        to={`/courses/${course._id}`}
                        className="flex-1 bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transition-all text-center text-sm"
                      >
                        {progress === 0 ? "Start Course" : progress >= 100 ? "Review Course" : "Continue Learning"} →
                      </Link>
                      
                      {progress >= 100 && (
                        <button className="flex items-center gap-2 bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition-all text-sm">
                          <Award size={16} />
                          View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Footer */}
        {averageProgress < 100 && (
          <div className="mt-8 bg-gradient-to-r from-[#409891] to-[#48ADB7] rounded-xl shadow-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Keep Going! 🚀</h3>
            <p className="text-white/90 mb-4">
              You're {averageProgress}% of the way through your courses. Stay consistent and you'll achieve your goals!
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-sm font-semibold">{inProgressCourses} Active</p>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-sm font-semibold">{completedCourses} Completed</p>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-sm font-semibold">{notStartedCourses} To Start</p>
              </div>
            </div>
          </div>
        )}

        {averageProgress === 100 && (
          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white text-center">
            <Award size={64} className="mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">Congratulations! 🎉</h3>
            <p className="text-xl text-white/90 mb-4">
              You've completed all your courses! You're a learning champion!
            </p>
            <button
              onClick={() => window.location.href =  "https://acadevo.vercel.app/courses"}
              className="bg-white text-green-600 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Explore More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}