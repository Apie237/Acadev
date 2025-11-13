import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  BarChart2,
  PlayCircle,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();

 const links = [
  { to: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
  { to: "/my-courses", label: "My Courses", icon: <BookOpen size={18} /> },
  { to: "/progress", label: "My Progress", icon: <BarChart2 size={18} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
];


  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-16"
        } bg-gray-900 text-gray-100 h-screen transition-all duration-300 flex flex-col`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-4 text-gray-300 hover:text-white"
        >
          <Menu />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <h1
            className={`font-bold text-xl text-green-400 transition-all ${
              open ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            LearnHub
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="flex-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-all ${
                  active
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                {link.icon}
                {open && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm bg-gray-800 hover:bg-red-600 transition-all"
        >
          <LogOut size={18} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
