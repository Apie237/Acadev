import { MessageCircle, Users, BookOpen, ChevronRight } from "lucide-react";

const GeneralFeed = ({ enrolledCourses, setSelectedCourse }) => {
  return (
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
              onClick={() => (window.location.href = "https://acadevo.vercel.app/courses")}
              className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralFeed;