const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#E6E5E1] p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Courses Section Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-12 animate-pulse"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Progress Card Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                <div className="w-full grid grid-cols-3 gap-3 text-center">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;