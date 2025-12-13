import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Clock, BookOpen, CheckCircle, PlayCircle, Users, Award, TrendingUp, ArrowLeft } from "lucide-react";
import api from "../utils/api.js";
import CourseDetailSkeleton from "../components/skeletons/CourseDetailSkeleton.jsx";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
    }
  };

  // In CourseDetail.js
useEffect(() => {
  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch course:", err);
    }
  };

  fetchCourse();
  fetchUser();

  // ✅ FIXED: Wait longer for webhook to process
  const sessionId = searchParams.get("session_id");
  if (sessionId) {
    console.log("🔄 Payment successful! Waiting for enrollment...");
    
    // ✅ Poll for enrollment status instead of single refetch
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkEnrollment = setInterval(async () => {
      attempts++;
      console.log(`🔍 Checking enrollment status (${attempts}/${maxAttempts})...`);
      
      await fetchUser();
      
      if (attempts >= maxAttempts) {
        clearInterval(checkEnrollment);
        console.log("⏰ Enrollment check timeout");
      }
    }, 2000); 
    
    
    return () => clearInterval(checkEnrollment);
  }
}, [id]);

  const learnHubUrl = "https://learnhubacadevo.vercel.app/";

  const handleGoToDashboard = () => {
    const token = localStorage.getItem("token");
    const dashboardUrl = token
      ? `${learnHubUrl}/dashboard?token=${token}`
      : "/login";
    window.location.href = dashboardUrl;
  };

  const handleBuy = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue");
      return navigate("/login");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/payments/create-checkout-session",
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Payment URL not found.");
      }
    } catch (err) {
      console.error("❌ Payment error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
  return <CourseDetailSkeleton />;
}

  const alreadyEnrolled = user?.enrolledCourses?.some((c) => c._id === course._id);

  // Default features if none provided
  const programFeatures = course.features || [
    "Start with 3-months Professional Foundations",
    "Building a standout design portfolio",
    "Help launching your graphic design career"
  ];

  return (
    <div className="min-h-screen bg-[#E6E5E1]">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-[#2d3e7e] via-[#4a3d80] to-[#6b4b8a] text-white overflow-hidden">
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#409891] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#48ADB7] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Courses</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block bg-[#00d9a3] text-white px-4 py-2 rounded-full font-bold text-sm mb-6">
                {course.category}
              </span>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Transform Your Creativity
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/20">
                <div>
                  <p className="text-[#00d9a3] font-bold text-sm mb-1">Duration</p>
                  <p className="text-2xl font-bold">{course.duration || 7} Months</p>
                </div>
                <div>
                  <p className="text-[#00d9a3] font-bold text-sm mb-1">Commitment</p>
                  <p className="text-2xl font-bold">20-30 hrs/week</p>
                </div>
                <div>
                  <p className="text-[#00d9a3] font-bold text-sm mb-1">Access Fee</p>
                  <p className="text-2xl font-bold">${course.price} a month</p>
                </div>
              </div>
            </div>

            {/* Right - Course Image with Play Button */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {course.thumbnail || course.imageUrl ? (
                  <img
                    src={course.thumbnail || course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-[#409891] to-[#48ADB7] flex items-center justify-center">
                    <BookOpen size={80} className="text-white opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                    <PlayCircle size={40} className="text-[#409891] fill-[#409891]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* From Beginner to Design Pro */}
            <div>
              <h2 className="text-4xl font-bold text-[#2d6b66] mb-6">
                From Beginner to Design Pro
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  The {course.title} programme equips you with the skills to create impactful visual designs, 
                  kick-starting your graphic design career.
                </p>
                <p>
                  Learn core design principles and how to tell compelling visual stories. You'll also build a 
                  portfolio, develop your own personal brand, and learn essential career skills to help you succeed.
                </p>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-3xl font-bold text-[#2d6b66] mb-6">What You'll Learn</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Master design fundamentals",
                  "Create stunning visual compositions",
                  "Build professional portfolio",
                  "Develop personal brand identity",
                  "Learn industry-standard tools",
                  "Understand color theory deeply"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={24} className="text-[#00d9a3] flex-shrink-0 mt-1" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum */}
            {course.lessons && course.lessons.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-3xl font-bold text-[#2d6b66] mb-6">Course Curriculum</h3>
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson._id}
                      className="flex items-center justify-between p-5 bg-gradient-to-r from-[#E6E5E1] to-white rounded-xl hover:shadow-md transition-all border border-[#BAD0CC]/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#409891] to-[#48ADB7] text-white font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#2d6b66]">{lesson.title}</h4>
                          {lesson.content && (
                            <p className="text-sm text-gray-600 line-clamp-1">{lesson.content}</p>
                          )}
                        </div>
                      </div>
                      {lesson.duration && (
                        <div className="flex items-center gap-2 text-gray-600 bg-[#BAD0CC]/30 px-3 py-2 rounded-lg">
                          <Clock size={16} />
                          <span className="font-medium">{lesson.duration} min</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#409891]/10 to-[#48ADB7]/10 rounded-2xl p-8 border border-[#409891]/20">
                <div className="w-14 h-14 bg-[#409891] rounded-xl flex items-center justify-center mb-4">
                  <Users className="text-white" size={28} />
                </div>
                <h4 className="text-xl font-bold text-[#2d6b66] mb-2">Expert Mentorship</h4>
                <p className="text-gray-600">Learn from industry professionals with years of experience</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#409891]/10 to-[#48ADB7]/10 rounded-2xl p-8 border border-[#409891]/20">
                <div className="w-14 h-14 bg-[#48ADB7] rounded-xl flex items-center justify-center mb-4">
                  <Award className="text-white" size={28} />
                </div>
                <h4 className="text-xl font-bold text-[#2d6b66] mb-2">Certification</h4>
                <p className="text-gray-600">Receive professional certificate upon completion</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#409891]/10 to-[#48ADB7]/10 rounded-2xl p-8 border border-[#409891]/20">
                <div className="w-14 h-14 bg-[#409891] rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="text-white" size={28} />
                </div>
                <h4 className="text-xl font-bold text-[#2d6b66] mb-2">Hands-on Projects</h4>
                <p className="text-gray-600">Build real-world projects for your portfolio</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#409891]/10 to-[#48ADB7]/10 rounded-2xl p-8 border border-[#409891]/20">
                <div className="w-14 h-14 bg-[#48ADB7] rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="text-white" size={28} />
                </div>
                <h4 className="text-xl font-bold text-[#2d6b66] mb-2">Career Support</h4>
                <p className="text-gray-600">Get guidance to launch your design career</p>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Pricing Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 border-2 border-[#BAD0CC]/50">
              <h3 className="text-2xl font-bold text-[#2d6b66] mb-6">This programme includes:</h3>
              
              <div className="space-y-4 mb-8">
                {programFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Enrollment Status */}
              {alreadyEnrolled && (
                <div className="bg-gradient-to-r from-[#00d9a3]/20 to-[#00c490]/20 border-2 border-[#00d9a3] rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-3 text-[#2d6b66]">
                    <CheckCircle size={24} className="text-[#00d9a3]" />
                    <span className="font-bold text-lg">You're Enrolled!</span>
                  </div>
                </div>
              )}

              {/* CTA Button - RESTORED ORIGINAL FUNCTIONALITY */}
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-bold py-5 px-8 rounded-2xl hover:from-[#48ADB7] hover:to-[#409891] transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                >
                  Login to Enroll
                </button>
              ) : alreadyEnrolled ? (
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-gradient-to-r from-[#00d9a3] to-[#00e5b0] text-white font-bold py-5 px-8 rounded-2xl hover:from-[#00c490] hover:to-[#00d19d] transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                >
                  Go to LearnHub Dashboard
                </button>
              ) : (
                <button
                  onClick={handleBuy}
                  disabled={loading}
                  className={`w-full font-bold py-5 px-8 rounded-2xl text-lg shadow-lg transition-all duration-300 text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#00d9a3] to-[#00e5b0] hover:from-[#00c490] hover:to-[#00d19d] hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    "Buy Now"
                  )}
                </button>
              )}

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t-2 border-[#BAD0CC]/30 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock size={20} className="text-[#409891]" />
                  <span className="font-medium">Lifetime access to all materials</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Award size={20} className="text-[#409891]" />
                  <span className="font-medium">Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={20} className="text-[#409891]" />
                  <span className="font-medium">Community support included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;