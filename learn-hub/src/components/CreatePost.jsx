import { useState } from "react";

const CreatePost = ({ user, onCreatePost }) => {
  const [newPost, setNewPost] = useState("");

  const handleSubmit = () => {
    onCreatePost(newPost);
    setNewPost("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts with the class..."
            className="w-full px-4 py-2 border-2 border-[#BAD0CC] rounded-lg focus:border-[#409891] focus:outline-none text-sm resize-none"
            rows="3"
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={handleSubmit}
              disabled={!newPost.trim()}
              className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;