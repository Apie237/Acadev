import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../utils/api.js';

const CourseSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  // Fetch courses from API
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

  // Extract unique categories from courses
  const categories = ['All', ...new Set(courses.map(course => course.category))];

  // Filter courses by category
  const filteredCourses = activeFilter === 'All' 
    ? courses 
    : courses.filter(course => course.category === activeFilter);

  // Show only 4 courses initially unless "showAll" is true
  const displayedCourses = showAll ? filteredCourses : filteredCourses.slice(0, 4);

  // Calculate course duration from lessons
  const getCourseDuration = (lessons) => {
    if (!lessons || lessons.length === 0) return 'Self-paced';
    const totalHours = lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
    const months = Math.ceil(totalHours / 40); // Assuming 40 hours per month
    return months > 0 ? `${months} Month${months > 1 ? 's' : ''}` : 'Self-paced';
  };

  const handleRegisterInterest = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleLearnMore = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xl text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-indigo-600 font-semibold mb-2">Acadevo Programs</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Most Popular Programs
          </h2>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveFilter(category);
                  setShowAll(false); // Reset to show only 4 when changing filter
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
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
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                      <span className="text-white text-4xl font-bold">
                        {course.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {!course.published && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                      Coming soon
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {getCourseDuration(course.lessons)}
                  </p>

                  {/* Buttons */}
                  <button 
                    onClick={() => handleRegisterInterest(course._id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg mb-3 transition-colors duration-300"
                  >
                    Register Interest
                  </button>
                  <button 
                    onClick={() => handleLearnMore(course._id)}
                    className="w-full text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-300"
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-colors duration-300"
            >
              Show {filteredCourses.length - 4} more
              <ArrowRight size={20} />
            </button>
          )}
          <button 
            onClick={() => navigate('/courses')}
            className="bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 font-semibold px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-colors duration-300"
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