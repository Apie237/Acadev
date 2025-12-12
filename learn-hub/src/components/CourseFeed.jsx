import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { MessageCircle, Hash } from "lucide-react";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import CourseFeedSkeleton from "./skeletons/CourseFeedSkeleton";

const CourseFeed = ({ courseId }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCoursePosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch course details
        const courseRes = await api.get(`/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(courseRes.data);

        // Fetch posts for this course
        const postsRes = await api.get(`/posts/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Error fetching course posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCoursePosts();
    }
  }, [courseId]);

  const handleCreatePost = async (newPost) => {
    if (!newPost.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/posts/create",
        { text: newPost, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([res.data, ...posts]);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/posts/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((p) => (p._id === postId ? { ...p, likes: res.data } : p)));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId, text) => {
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/posts/comment/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((p) => (p._id === postId ? res.data : p)));
    } catch (err) {
      console.error("Error commenting on post:", err);
    }
  };

  if (loading) {
    return <CourseFeedSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#E6E5E1]">
      {/* Course Header */}
      <div className="bg-white border-b border-[#BAD0CC]/30 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-lg flex items-center justify-center">
              <Hash size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2d6b66]">{course?.title}</h1>
              <p className="text-sm text-gray-600">{posts.length} posts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Create Post */}
        <CreatePost user={user} onCreatePost={handleCreatePost} />

        {/* Posts Feed */}
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onLike={handleLikePost}
                onComment={handleComment}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#2d6b66] mb-2">No Posts Yet</h3>
            <p className="text-gray-600">Be the first to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseFeed;