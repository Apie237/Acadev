import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, BookOpen, Loader } from "lucide-react";
import api from "../utils/api.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Password strength checker
  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: "text-red-500" },
      { strength: 2, label: "Fair", color: "text-orange-500" },
      { strength: 3, label: "Good", color: "text-yellow-500" },
      { strength: 4, label: "Strong", color: "text-green-500" }
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (name.length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", { name, email, password });
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.response?.status === 409 || err.response?.data?.message?.includes("exists")) {
        setError("This email is already registered. Please login instead.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === "Network Error") {
        setError("Unable to connect to server. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E6E5E1] via-[#BAD0CC]/20 to-[#E6E5E1] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#2d6b66] mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E5E1] via-[#BAD0CC]/20 to-[#E6E5E1] flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#409891]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#48ADB7]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#409891] to-[#48ADB7] bg-clip-text text-transparent">
              Acadevo
            </h1>
          </div>
          <p className="text-gray-600">Start your learning journey today!</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-[#BAD0CC]/30">
          <h2 className="text-2xl font-bold text-[#2d6b66] mb-6 text-center">Create Your Account</h2>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-[#2d6b66] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BAD0CC] rounded-xl focus:border-[#409891] focus:outline-none focus:ring-2 focus:ring-[#409891]/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#2d6b66] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BAD0CC] rounded-xl focus:border-[#409891] focus:outline-none focus:ring-2 focus:ring-[#409891]/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#2d6b66] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-12 py-3 border-2 border-[#BAD0CC] rounded-xl focus:border-[#409891] focus:outline-none focus:ring-2 focus:ring-[#409891]/20 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#409891] transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <p className={`text-xs mt-1 font-medium ${passwordStrength.color}`}>
                  Password Strength: {passwordStrength.label}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#2d6b66] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-12 py-3 border-2 border-[#BAD0CC] rounded-xl focus:border-[#409891] focus:outline-none focus:ring-2 focus:ring-[#409891]/20 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#409891] transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">Passwords don't match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#409891] to-[#48ADB7] hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin" size={20} />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#409891] font-bold hover:text-[#2d6b66]">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing up, you agree to Acadevo's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;