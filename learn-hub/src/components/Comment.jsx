const Comment = ({ comment }) => {
  return (
    <div className="flex gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {comment.user?.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
        <p className="font-semibold text-sm text-[#2d6b66]">{comment.user?.name}</p>
        <p className="text-sm text-gray-800">{comment.text}</p>
      </div>
    </div>
  );
};

export default Comment;