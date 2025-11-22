import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle,
  BookOpen,
  Clock,
  Award,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function LessonPlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, updateCourseProgress } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login");
          return;
        }

        const [courseRes, progressRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/progress/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        setCourse(courseRes.data);
        setProgress(progressRes.data);

        // Find first incomplete lesson or start from beginning
        const firstIncompleteIndex = courseRes.data.lessons.findIndex(
          (lesson) => !progressRes.data.completedLessons.includes(lesson._id)
        );
        setCurrentLessonIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
      } catch (err) {
        console.error("❌ Error fetching course or progress:", err);
        setError(err.response?.data?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, navigate]);

  const markLessonComplete = async (lessonId) => {
    try {
      setMarkingComplete(true);
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/progress/${courseId}/complete/${lessonId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(res.data);

      // Update course progress in context
      updateCourseProgress(courseId, res.data.progressPercentage);

      // Auto-advance to next lesson if not the last one
      if (currentLessonIndex < course.lessons.length - 1) {
        setTimeout(() => {
          setCurrentLessonIndex(currentLessonIndex + 1);
        }, 800);
      }
    } catch (err) {
      console.error("❌ Error marking lesson complete:", err);
      alert("Failed to mark lesson as complete. Please try again.");
    } finally {
      setMarkingComplete(false);
    }
  };

  const goPrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goNext = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectLesson = (index) => {
    setCurrentLessonIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#409891] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-lg font-semibold text-[#2d6b66]">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Course</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/my-courses")}
            className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-6 py-2 rounded-xl hover:shadow-lg transition-all text-sm"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const lesson = course.lessons[currentLessonIndex];
  const isDone = progress?.completedLessons?.includes(lesson._id);
  const completedCount = progress?.completedLessons?.length || 0;
  const totalLessons = course.lessons.length;
  const overallProgress = Math.round(progress?.progressPercentage || 0);

  return (
    <div className="min-h-screen bg-[#E6E5E1]">
      {/* Header Bar */}
      <div className="bg-white border-b-2 border-[#BAD0CC] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/my-courses")}
              className="flex items-center gap-2 text-[#409891] hover:text-[#2d6b66] font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to My Courses</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs text-gray-600">Progress</p>
                <p className="text-sm font-bold text-[#409891]">{overallProgress}%</p>
              </div>
              <div className="w-24 h-2 bg-[#BAD0CC]/30 rounded-full overflow-hidden hidden md:block">
                <div
                  className="h-full bg-gradient-to-r from-[#409891] to-[#48ADB7] transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Course Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#2d6b66] mb-1">{course.title}</h1>
          <p className="text-sm text-gray-600">
            Lesson {currentLessonIndex + 1} of {totalLessons} • {completedCount} completed
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Lesson Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Video Section */}
              {lesson.videoUrl ? (
                <div className="relative bg-black aspect-video">
                  <video 
                    src={lesson.videoUrl} 
                    controls 
                    className="w-full h-full"
                    controlsList="nodownload"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#409891] to-[#48ADB7] flex items-center justify-center">
                  <PlayCircle size={80} className="text-white opacity-50" />
                </div>
              )}

              {/* Lesson Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#2d6b66] mb-2">
                      {lesson.title}
                    </h2>
                    {lesson.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{lesson.duration} minutes</span>
                      </div>
                    )}
                  </div>
                  {isDone && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                      <CheckCircle size={20} />
                      <span className="text-sm font-semibold">Completed</span>
                    </div>
                  )}
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {lesson.content}
                  </p>
                </div>

                {/* Mark Complete Button */}
                <button
                  onClick={() => markLessonComplete(lesson._id)}
                  disabled={isDone || markingComplete}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    isDone
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : markingComplete
                      ? "bg-gray-400 text-white cursor-wait"
                      : "bg-gradient-to-r from-[#00d9a3] to-[#00e5b0] text-white hover:shadow-lg hover:scale-[1.02]"
                  }`}
                >
                  {markingComplete ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Marking Complete...
                    </span>
                  ) : isDone ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle size={24} />
                      Lesson Completed
                    </span>
                  ) : (
                    "Mark as Complete"
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={goPrev}
                disabled={currentLessonIndex === 0}
                className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  currentLessonIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-[#409891] hover:bg-[#409891] hover:text-white border-2 border-[#409891]"
                }`}
              >
                <ChevronLeft size={20} />
                Previous Lesson
              </button>
              
              <button
                onClick={goNext}
                disabled={currentLessonIndex === course.lessons.length - 1}
                className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  currentLessonIndex === course.lessons.length - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white hover:shadow-lg"
                }`}
              >
                Next Lesson
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-4">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#409891]/10 rounded-lg flex items-center justify-center">
                  <Award className="text-[#409891]" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Course Progress</p>
                  <p className="text-xl font-bold text-[#2d6b66]">{overallProgress}%</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full h-3 bg-[#BAD0CC]/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#409891] to-[#48ADB7] transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {completedCount} of {totalLessons} lessons completed
                </p>
              </div>

              {overallProgress === 100 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 text-center">
                  <Award size={32} className="text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-green-700">Course Completed! 🎉</p>
                </div>
              )}
            </div>

            {/* Lessons List */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-bold text-[#2d6b66] mb-3 flex items-center gap-2">
                <BookOpen size={18} />
                Course Lessons
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.lessons.map((les, index) => {
                  const isCompleted = progress?.completedLessons?.includes(les._id);
                  const isCurrent = index === currentLessonIndex;

                  return (
                    <button
                      key={les._id}
                      onClick={() => selectLesson(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isCurrent
                          ? "bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white shadow-md"
                          : isCompleted
                          ? "bg-green-50 hover:bg-green-100"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle 
                              size={20} 
                              className={isCurrent ? "text-white" : "text-green-600"} 
                            />
                          ) : (
                            <Circle 
                              size={20} 
                              className={isCurrent ? "text-white" : "text-gray-400"} 
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${
                            isCurrent ? "text-white" : "text-[#2d6b66]"
                          }`}>
                            {index + 1}. {les.title}
                          </p>
                          {les.duration && (
                            <p className={`text-xs ${
                              isCurrent ? "text-white/80" : "text-gray-500"
                            }`}>
                              {les.duration} min
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}