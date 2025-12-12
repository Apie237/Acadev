import { useState } from "react";
import { MessageCircle } from "lucide-react";
import CommentSection from "./CommentSection";

const PostCard = ({ post, currentUser, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const isLiked = post.likes?.includes(currentUser?._id);
  const timeAgo = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {post.user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-[#2d6b66]">{post.user?.name}</h4>
            <span className="text-xs text-gray-500">• {timeAgo}</span>
          </div>
          <p className="text-sm text-gray-600">{post.user?.email}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>
        {post.img && (
          <img
            src={post.img}
            alt="Post"
            className="mt-3 rounded-lg max-h-96 w-full object-cover"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#409891] transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comment Section */}
      <CommentSection
        post={post}
        showCommentInput={showCommentInput}
        showComments={showComments}
        setShowComments={setShowComments}
        onComment={onComment}
      />
    </div>
  );
};

export default PostCard;