import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MessageCircle, Users, BookOpen, TrendingUp, ChevronRight, Hash, Globe, ChevronLeft, LogOut, Home } from "lucide-react";
import api from "../utils/api";
import BeaconChat from "../components/BeaconChat";

export default function CourseConnect({ onLogout }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await api.get(`/users/${user._id}/enrolled`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#409891] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-lg font-semibold text-[#2d6b66]">Loading CourseConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#E6E5E1] relative">
      {/* CourseConnect Sidebar - Separate from main sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white border-r border-[#BAD0CC]/30 h-screen transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#BAD0CC]/30">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-lg flex items-center justify-center">
                    <Hash className="text-white" size={16} />
                  </div>
                  <h2 className="font-bold text-lg text-[#2d6b66]">Channels</h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 hover:bg-[#BAD0CC]/20 rounded-lg transition-all"
                >
                  <ChevronLeft className="text-[#409891]" size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex justify-center p-1.5 hover:bg-[#BAD0CC]/20 rounded-lg transition-all"
              >
                <ChevronRight className="text-[#409891]" size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="p-3 border-b border-[#BAD0CC]/30">
          <button
            onClick={() => navigate('/dashboard')}
            title={!sidebarOpen ? "Back to Dashboard" : ""}
            className={`flex items-center w-full ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-[#BAD0CC]/20`}
          >
            <Home size={18} />
            {sidebarOpen && <span className="font-medium text-sm">Back to Dashboard</span>}
          </button>
        </div>

        {/* General Channel */}
        <div className="p-3">
          <div
            onClick={() => setSelectedCourse(null)}
            title={!sidebarOpen ? "General" : ""}
            className={`flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg cursor-pointer transition-all ${
              selectedCourse === null
                ? "bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white"
                : "text-gray-700 hover:bg-[#BAD0CC]/20"
            }`}
          >
            <Globe size={18} />
            {sidebarOpen && <span className="font-medium text-sm">General</span>}
          </div>
        </div>

        {/* Course Channels */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {sidebarOpen && (
            <div className="mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide px-3 py-2">
                Course Channels
              </p>
            </div>
          )}
          <div className="space-y-1">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => setSelectedCourse(course._id)}
                title={!sidebarOpen ? course.title : ''}
                className={`flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg cursor-pointer transition-all group ${
                  selectedCourse === course._id
                    ? "bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white"
                    : "text-gray-700 hover:bg-[#BAD0CC]/20"
                }`}
              >
                <Hash size={16} className={selectedCourse === course._id ? "" : "text-gray-400"} />
                {sidebarOpen && <span className="font-medium text-sm line-clamp-1">{course.title}</span>}
              </div>
            ))}
          </div>

          {enrolledCourses.length === 0 && sidebarOpen && (
            <div className="text-center py-8 px-4">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-xs text-gray-500">No courses enrolled yet</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-[#BAD0CC]/30 mt-auto">
          <button
            onClick={onLogout}
            title={!sidebarOpen ? "Logout" : ""}
            className={`flex items-center w-full ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-red-50 hover:text-red-600`}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        {selectedCourse ? (
          <CourseFeed courseId={selectedCourse} />
        ) : (
          <div className="min-h-screen bg-[#E6E5E1] p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2d6b66] mb-2">Welcome to CourseConnect</h1>
                <p className="text-gray-600">Connect with fellow learners in your courses</p>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-xl flex items-center justify-center">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Courses</p>
                      <p className="text-2xl font-bold text-[#2d6b66]">{enrolledCourses.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fellow Students</p>
                      <p className="text-2xl font-bold text-[#2d6b66]">-</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <MessageCircle className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Posts</p>
                      <p className="text-2xl font-bold text-[#2d6b66]">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses Overview */}
              {enrolledCourses.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-[#2d6b66] mb-4">Your Course Communities</h2>
                  <div className="space-y-3">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course._id}
                        onClick={() => setSelectedCourse(course._id)}
                        className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg cursor-pointer hover:shadow-md transition-all border border-gray-200 hover:border-[#409891] group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen className="text-white" size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#2d6b66] group-hover:text-[#409891] transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600">{course.category}</p>
                          </div>
                        </div>
                        <ChevronRight className="text-[#409891] group-hover:translate-x-2 transition-transform" size={20} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <div className="w-20 h-20 bg-[#BAD0CC]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={40} className="text-[#409891]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2d6b66] mb-2">No Courses Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Enroll in courses to start connecting with fellow learners!
                  </p>
                  <button
                    onClick={() => window.location.href = "http://localhost:5173/courses"}
                    className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* BeaconChat */}
      <BeaconChat />
    </div>
  );
}

// Course Feed Component
function CourseFeed({ courseId }) {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [course, setCourse] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  useEffect(() => {
    const fetchCoursePosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Fetch course details
        const courseRes = await api.get(`/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourse(courseRes.data);

        // Fetch posts for this course
        const postsRes = await api.get(`/posts/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
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

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/posts/create",
        { text: newPost, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([res.data, ...posts]);
      setNewPost("");
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
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data } : p));
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
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (err) {
      console.error("Error commenting on post:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6E5E1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#409891] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-lg font-semibold text-[#2d6b66]">Loading posts...</p>
        </div>
      </div>
    );
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
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-full flex items-center justify-center text-white font-bold">
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
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

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
}

// Post Card Component
function PostCard({ post, currentUser, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleSubmitComment = () => {
    onComment(post._id, commentText);
    setCommentText("");
    setShowCommentInput(false);
  };

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

      {/* Comment Input */}
      {showCommentInput && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border-2 border-[#BAD0CC] rounded-lg focus:border-[#409891] focus:outline-none text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Comments */}
      {post.comments?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm font-medium text-[#409891] hover:text-[#2d6b66] mb-2"
          >
            {showComments ? "Hide" : "View"} {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
          </button>
          
          {showComments && (
            <div className="space-y-3 mt-3">
              {post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                    <p className="font-semibold text-sm text-[#2d6b66]">{comment.user?.name}</p>
                    <p className="text-sm text-gray-800">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}