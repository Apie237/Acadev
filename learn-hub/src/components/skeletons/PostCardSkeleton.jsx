const PostCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      {/* Post Header Skeleton */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
      </div>

      {/* Post Content Skeleton */}
      <div className="mb-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>

      {/* Post Actions Skeleton */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;