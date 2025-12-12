const MyCoursesSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#E6E5E1] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-7 bg-gray-200 rounded w-40 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-7 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Skeleton */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full sm:w-48 animate-pulse"></div>
          </div>
        </div>

        {/* Courses Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden border border-[#BAD0CC]/30">
              {/* Image Skeleton */}
              <div className="h-40 bg-gray-200 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded-full w-20 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                
                {/* Progress Bar Skeleton */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Footer Skeleton */}
                <div className="flex items-center justify-between pt-3 border-t border-[#BAD0CC]/30">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesSkeleton;