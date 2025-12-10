import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  MessageCircle,
} from "lucide-react";

export default function Sidebar({ onLogout, open, setOpen }) {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/my-courses", label: "My Courses", icon: BookOpen },
    { to: "/progress", label: "My Progress", icon: BarChart2 },
    { to: "/course-connect", label: "CourseConnect", icon: MessageCircle },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes oscillate {
          0%, 100% {
            transform: translateX(0) scale(1);
          }
          25% {
            transform: translateX(3px) scale(1.02);
          }
          75% {
            transform: translateX(-3px) scale(1.02);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .oscillate-hover:hover .oscillate-bg {
          animation: oscillate 0.8s ease-in-out infinite;
        }

        .oscillate-hover:hover .oscillate-icon {
          animation: oscillate 0.6s ease-in-out infinite;
        }

        .glow-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Sidebar - Fixed Position */}
      <div
        className={`${
          open ? "w-72" : "w-20"
        } bg-white border-r border-[#BAD0CC]/30 h-screen transition-all duration-300 flex flex-col shadow-lg fixed top-0 left-0 z-50`}
      >
        {/* Header with Toggle */}
        <div className="p-6 border-b border-[#BAD0CC]/30">
          <div className="flex items-center justify-between">
            {open ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="text-white" size={20} />
                </div>
                <h1 className="font-bold text-2xl bg-gradient-to-r from-[#409891] to-[#48ADB7] bg-clip-text text-transparent">
                  LearnHub
                </h1>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="text-white" size={20} />
              </div>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 hover:bg-[#BAD0CC]/20 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-180"
            >
              {open ? (
                <X className="text-[#409891]" size={20} />
              ) : (
                <Menu className="text-[#409891]" size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const active = location.pathname === link.to;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden oscillate-hover ${
                  active
                    ? "bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white shadow-lg"
                    : "text-gray-700 hover:bg-[#BAD0CC]/20"
                }`}
              >
                {/* Oscillating background effect on hover */}
                {!active && (
                  <div className="oscillate-bg absolute inset-0 bg-gradient-to-r from-[#409891]/10 to-[#48ADB7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                {/* Glow effect for active item */}
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#409891] to-[#48ADB7] opacity-20 glow-pulse"></div>
                )}
                
                {/* Icon with scale and rotation animation */}
                <div className={`oscillate-icon relative z-10 transition-all duration-300 ${
                  active ? "scale-110" : "group-hover:scale-125 group-hover:rotate-12"
                }`}>
                  <Icon size={20} />
                </div>
                
                {/* Label with slide effect */}
                {open && (
                  <span className={`relative z-10 transition-all duration-300 ${
                    active ? "font-semibold" : "group-hover:translate-x-2"
                  }`}>
                    {link.label}
                  </span>
                )}
                
                {/* Active indicator dot */}
                {active && !open && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-white rounded-l-full"></div>
                )}

                {/* Active indicator line for expanded */}
                {active && open && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg"></div>
                )}
              </Link>
            );
          })}
        </nav>

       
        {/* Compact User Avatar when closed */}
        {!open && (
          <div className="px-2 py-3 border-t border-[#BAD0CC]/30">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#409891] to-[#48ADB7] rounded-full flex items-center justify-center text-white font-bold shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer">
              <User size={24} />
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="p-4 border-t border-[#BAD0CC]/30">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group relative overflow-hidden oscillate-hover"
          >
            {/* Oscillating background */}
            <div className="oscillate-bg absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Icon with bounce effect */}
            <div className="oscillate-icon relative z-10 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12">
              <LogOut size={20} />
            </div>
            
            {open && (
              <span className="relative z-10 transition-all duration-300 group-hover:translate-x-2 font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}