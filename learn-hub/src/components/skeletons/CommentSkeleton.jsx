const CommentSkeleton = () => {
  return (
    <div className="flex gap-2">
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>
    </div>
  );
};

export default CommentSkeleton;