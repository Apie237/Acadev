const CommentSectionSkeleton = () => {
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {/* View Comments Button Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>

      {/* Comments List Skeleton */}
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
              <div className="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSectionSkeleton;