import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/courses", label: "Courses", icon: <BookOpen size={18} /> },
    { to: "/courses/new", label: "Add Course", icon: <PlusCircle size={18} /> },
    { to: "/users", label: "Users", icon: <Users size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-gray-900 text-gray-100 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 text-xl font-bold text-green-400 border-b border-gray-800">
        Acadevo Admin
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-all duration-150 ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}
