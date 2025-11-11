import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "My Courses", path: "/my-courses" },
    { name: "Lessons", path: "/lessons" },
    { name: "Progress", path: "/progress" },
    { name: "Quizzes", path: "/quizzes" },
    { name: "Certificates", path: "/certificates" },
    { name: "Events", path: "/events" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-6">LearnHub</h2>
      <ul>
        {links.map(link => (
          <li key={link.path} className="mb-4">
            <Link
              to={link.path}
              className={`block px-3 py-2 rounded ${
                pathname === link.path ? "bg-green-600" : "hover:bg-gray-700"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
