import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../utils/api.js';
import AcadevoLoader from './AcadevoLoader.jsx';

const CourseSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = ['All', ...new Set(courses.map(course => course.category))];

  const filteredCourses = activeFilter === 'All' 
    ? courses 
    : courses.filter(course => course.category === activeFilter);

  const displayedCourses = showAll ? filteredCourses : filteredCourses.slice(0, 4);

  const getCourseDuration = (lessons) => {
    if (!lessons || lessons.length === 0) return 'Self-paced';
    const totalHours = lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
    const months = Math.ceil(totalHours / 40);
    return months > 0 ? `${months} Month${months > 1 ? 's' : ''}` : 'Self-paced';
  };

  const handleRegisterInterest = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleLearnMore = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) return <AcadevoLoader/>

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#48ADB7] font-semibold mb-2 text-lg">Acadevo Programs</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-8">
            Most Popular Programs
          </h2>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveFilter(category);
                  setShowAll(false);
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white shadow-lg'
                    : 'bg-white text-[#1F2937] border border-gray-300 hover:border-[#48ADB7] hover:text-[#48ADB7]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        {displayedCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No programs available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {displayedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {course.thumbnail || course.imageUrl ? (
                    <img
                      src={course.thumbnail || course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#409891] to-[#48ADB7]">
                      <span className="text-white text-4xl font-bold">
                        {course.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {!course.published && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-[#1F2937] text-xs font-semibold px-3 py-1 rounded-full">
                      Coming soon
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#1F2937] mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {getCourseDuration(course.lessons)}
                  </p>

                  {/* Buttons */}
                  <button 
                    onClick={() => handleRegisterInterest(course._id)}
                    className="w-full bg-gradient-to-r from-[#409891] to-[#48ADB7] hover:from-[#48ADB7] hover:to-[#409891] text-white font-semibold py-3 rounded-xl mb-3 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Register Interest
                  </button>
                  <button 
                    onClick={() => handleLearnMore(course._id)}
                    className="w-full text-[#48ADB7] font-semibold hover:text-[#409891] transition-colors duration-300"
                  >
                    Learn more
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!showAll && filteredCourses.length > 4 && (
            <button
              onClick={() => setShowAll(true)}
              className="bg-gradient-to-r from-[#409891] to-[#48ADB7] hover:from-[#48ADB7] hover:to-[#409891] text-white font-semibold px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Show {filteredCourses.length - 4} more
              <ArrowRight size={20} />
            </button>
          )}
          <button 
            onClick={() => navigate('/courses')}
            className="bg-white hover:bg-gray-50 text-[#48ADB7] border-2 border-[#48ADB7] hover:border-[#409891] hover:text-[#409891] font-semibold px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
          >
            View All Programs
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSection;