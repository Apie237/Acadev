const CreatePostSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-20 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <div className="h-9 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostSkeleton;