import React from "react";
const CourseDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#E6E5E1]">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-br from-[#2d3e7e] via-[#4a3d80] to-[#6b4b8a] text-white overflow-hidden">
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#409891] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#48ADB7] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Back Button Skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-32 animate-pulse"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content Skeleton */}
            <div>
              <div className="h-8 bg-white/20 rounded-full w-32 mb-6 animate-pulse"></div>
              <div className="h-14 bg-white/20 rounded w-full mb-4 animate-pulse"></div>
              <div className="h-14 bg-white/20 rounded w-4/5 mb-6 animate-pulse"></div>
              
              <div className="space-y-3 mb-8">
                <div className="h-6 bg-white/20 rounded w-full animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded w-5/6 animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded w-4/5 animate-pulse"></div>
              </div>

              {/* Course Stats Skeleton */}
              <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/20">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-white/20 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-8 bg-white/20 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Course Image Skeleton */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/20 h-96 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-12">
            {/* Title Section Skeleton */}
            <div>
              <div className="h-10 bg-gray-200 rounded w-2/3 mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              </div>
            </div>

            {/* What You'll Learn Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse flex-shrink-0 mt-1"></div>
                    <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="h-8 bg-gray-200 rounded w-56 mb-6 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-[#E6E5E1] to-white rounded-xl border border-[#BAD0CC]/30"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid Skeleton */}
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-[#409891]/10 to-[#48ADB7]/10 rounded-2xl p-8 border border-[#409891]/20"
                >
                  <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sticky Pricing Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 border-2 border-[#BAD0CC]/50">
              <div className="h-7 bg-gray-200 rounded w-full mb-6 animate-pulse"></div>

              <div className="space-y-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse flex-shrink-0 mt-0.5"></div>
                    <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* CTA Button Skeleton */}
              <div className="h-14 bg-gray-200 rounded-2xl mb-8 animate-pulse"></div>

              {/* Additional Info Skeleton */}
              <div className="mt-8 pt-8 border-t-2 border-[#BAD0CC]/30 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailSkeleton;