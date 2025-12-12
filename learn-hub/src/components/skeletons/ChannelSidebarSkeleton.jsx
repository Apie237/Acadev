const ChannelSidebarSkeleton = () => {
  return (
    <div className="w-64 bg-white border-r border-[#BAD0CC]/30 h-screen flex flex-col shadow-lg">
      {/* Header Skeleton */}
      <div className="p-4 border-b border-[#BAD0CC]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Back to Dashboard Skeleton */}
      <div className="p-3 border-b border-[#BAD0CC]/30">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* General Channel Skeleton */}
      <div className="p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>

      {/* Course Channels Skeleton */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="mb-2">
          <div className="h-3 bg-gray-200 rounded w-32 px-3 py-2 animate-pulse"></div>
        </div>
        <div className="space-y-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button Skeleton */}
      <div className="p-3 border-t border-[#BAD0CC]/30 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebarSkeleton;