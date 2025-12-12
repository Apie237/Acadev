import { useState } from "react";
import CommentInput from "./CommentInput";
import Comment from "./Comment";

const CommentSection = ({ post, showCommentInput, showComments, setShowComments, onComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    onComment(post._id, commentText);
    setCommentText("");
  };

  return (
    <>
      {/* Comment Input */}
      {showCommentInput && (
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          onSubmit={handleSubmitComment}
        />
      )}

      {/* Comments List */}
      {post.comments?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm font-medium text-[#409891] hover:text-[#2d6b66] mb-2"
          >
            {showComments ? "Hide" : "View"} {post.comments.length} comment
            {post.comments.length !== 1 ? "s" : ""}
          </button>

          {showComments && (
            <div className="space-y-3 mt-3">
              {post.comments.map((comment, idx) => (
                <Comment key={idx} comment={comment} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CommentSection;