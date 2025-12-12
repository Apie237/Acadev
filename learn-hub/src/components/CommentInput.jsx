const CommentInput = ({ commentText, setCommentText, onSubmit }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && commentText.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border-2 border-[#BAD0CC] rounded-lg focus:border-[#409891] focus:outline-none text-sm"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={onSubmit}
          disabled={!commentText.trim()}
          className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentInput;