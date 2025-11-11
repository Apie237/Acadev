import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api.js";

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
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
    }
  };

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

    // ✅ Check if returning from Stripe checkout
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // Stripe redirected back, refetch user data after a short delay
      // to allow webhook to process
      setTimeout(() => {
        console.log("🔄 Refetching user after Stripe redirect...");
        fetchUser();
      }, 2000); // 2 second delay for webhook processing
      
      // Clean up URL
      searchParams.delete("session_id");
      navigate(`/courses/${id}`, { replace: true });
    }
  }, [id, searchParams, navigate]);

  const learnHubUrl = "http://localhost:5174";

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

  if (!course) return <p className="p-6">Loading course...</p>;

  const alreadyEnrolled = user?.enrolledCourses?.some((c) => c._id === course._id);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-700">{course.description}</p>
      <p className="mt-2 font-semibold text-lg">${course.price}</p>

      {!user ? (
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Login to Enroll
        </button>
      ) : alreadyEnrolled ? (
        <button
          onClick={handleGoToDashboard}
          className="mt-4 px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Go to LearnHub Dashboard
        </button>
      ) : (
        <button
          onClick={handleBuy}
          disabled={loading}
          className={`mt-4 px-6 py-2 rounded text-white ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Buy Now"}
        </button>
      )}
    </div>
  );
};

export default CourseDetail;