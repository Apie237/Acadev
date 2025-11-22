import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ArrowRight, Info } from "lucide-react";

const CourseCard = ({ course }) => {
  const totalLessons = course.lessons?.length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      {/* Course Image */}
      <Link to={`/courses/${course._id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#409891] to-[#48ADB7]">
          {course.thumbnail || course.imageUrl ? (
            <img
              src={course.thumbnail || course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={48} className="text-white opacity-50" />
            </div>
          )}
          
          {/* Status Badge */}
          {course.status && (
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                course.status === "TBA" 
                  ? "bg-purple-500 text-white" 
                  : "bg-yellow-400 text-gray-900"
              }`}>
                {course.status}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Course Content */}
      <div className="p-6">
        {/* Course Title */}
        <Link to={`/courses/${course._id}`}>
          <h3 className="text-xl font-bold text-[#2d6b66] mb-3 line-clamp-2 group-hover:text-[#409891] transition-colors">
            {course.title}
          </h3>
        </Link>

        {/* Course Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Course Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-[#BAD0CC]">
          <div className="flex items-center gap-1">
            <BookOpen size={16} className="text-[#409891]" />
            <span>{totalLessons} Lessons</span>
          </div>
          {course.duration && (
            <div className="flex items-center gap-1">
              <Calendar size={16} className="text-[#409891]" />
              <span>{course.duration} Months</span>
            </div>
          )}
        </div>

        {/* Price Display */}
        {course.price !== undefined && (
          <div className="mb-4">
            <p className="text-2xl font-bold text-[#2d6b66]">
              ${course.price}
              <span className="text-sm font-normal text-gray-500 ml-2">/month</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            to={`/courses/${course._id}`}
            className="w-full bg-gradient-to-r from-[#00d9a3] to-[#00e5b0] text-white font-bold py-3 px-6 rounded-xl hover:from-[#00c490] hover:to-[#00d19d] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            Register Interest
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to={`/courses/${course._id}`}
            className="w-full text-[#409891] font-semibold py-2 hover:text-[#2d6b66] transition-colors flex items-center justify-center gap-2 group"
          >
            <Info size={18} />
            View Full Details
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;