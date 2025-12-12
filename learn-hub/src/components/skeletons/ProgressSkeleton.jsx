const ProgressSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#E6E5E1] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-7 bg-gray-200 rounded w-48 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="h-7 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
          ))}
          {/* Average Progress Skeleton */}
          <div className="bg-gray-200 rounded-xl shadow p-4 col-span-2 lg:col-span-1 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="h-7 bg-gray-300 rounded w-16"></div>
          </div>
        </div>

        {/* Progress List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow border border-[#BAD0CC]/30 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image Skeleton */}
                <div className="md:w-56 h-40 md:h-auto bg-gray-200 animate-pulse"></div>

                {/* Details Skeleton */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="h-8 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Progress Bar Skeleton */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>

                  {/* Buttons Skeleton */}
                  <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSkeleton;