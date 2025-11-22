import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Bell, Search, User } from "lucide-react";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-[#2d6b66] via-[#409891] to-[#48ADB7] shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Welcome Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
              <User className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Welcome back,</p>
              <h2 className="text-white text-xl font-bold">{user?.name || "Student"}</h2>
            </div>
          </div>

          {/* Right Side - Search & Notifications */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Search className="text-white/70" size={18} />
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-transparent border-none outline-none text-white placeholder-white/60 ml-2 w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
              <Bell className="text-white" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </span>
            </button>

            {/* Profile Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-white to-[#E6E5E1] rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform duration-300">
              <span className="text-[#409891] font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;