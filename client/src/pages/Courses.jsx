import React, { useState, useEffect, useMemo } from "react";
import { Filter, X } from "lucide-react";
import api from "../utils/api";
import CourseCard from "../components/CourseCard";
import CoursesPageSkeleton from "../components/skeletons/CoursePageSkeleton";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true); 

  const categories = [
    "Career",
    "Creative Tech",
    "Cyber Security",
    "Data",
    "Entrepreneurship",
    "Tech"
  ];

  // ✅ Fetch courses on mount with loading state
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ✅ Use useMemo to prevent unnecessary re-filtering
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course =>
        selectedCategories.includes(course.category)
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(lowerSearch) ||
        course.description.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [courses, selectedCategories, searchTerm]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
  };

  const showAllCourses = () => {
    setSelectedCategories([]);
  };

  // ✅ Show skeleton while loading
  if (loading) {
    return <CoursesPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#E6E5E1]">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Our Programmes</h1>
          <p className="text-xl text-white/90">Discover courses that fit your learning goals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between bg-[#409891] text-white px-4 py-3 rounded-xl font-semibold mb-4"
              >
                <span className="flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </span>
                {showFilters ? <X size={20} /> : <Filter size={20} />}
              </button>

              {/* Filter Content */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
                {/* Show All Button */}
                <button
                  onClick={showAllCourses}
                  className="w-full bg-[#48ADB7] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#409891] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Show All
                </button>

                {/* Filter Header */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-[#BAD0CC]">
                  <h3 className="text-lg font-bold text-[#2d6b66]">Filter by</h3>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#409891] hover:text-[#2d6b66] font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filters */}
                <div>
                  <h4 className="font-bold text-[#2d6b66] mb-4 text-base">Category</h4>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-5 h-5 rounded border-2 border-[#409891] text-[#409891] focus:ring-[#409891] focus:ring-2 cursor-pointer"
                          />
                        </div>
                        <span className="text-gray-700 group-hover:text-[#409891] transition-colors font-medium">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters Display */}
                {selectedCategories.length > 0 && (
                  <div className="pt-4 border-t border-[#BAD0CC]">
                    <p className="text-sm font-semibold text-[#2d6b66] mb-2">
                      Active Filters ({selectedCategories.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map(category => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-2 bg-[#BAD0CC] text-[#2d6b66] px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {category}
                          <button
                            onClick={() => toggleCategory(category)}
                            className="hover:text-red-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Course Grid */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search for a course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-[#BAD0CC] focus:border-[#409891] focus:outline-none focus:ring-2 focus:ring-[#409891]/20 text-gray-700 placeholder-gray-400 shadow-sm"
              />
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 font-medium">
                Showing <span className="text-[#409891] font-bold">{filteredCourses.length}</span> courses
              </p>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-2xl font-bold text-[#2d6b66] mb-2">No courses found</p>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={clearFilters}
                    className="bg-[#409891] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2d6b66] transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;