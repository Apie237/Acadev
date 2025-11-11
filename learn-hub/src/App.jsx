import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import Lessons from "./pages/Lessons";
import Progress from "./pages/Progress";
import Quizzes from "./pages/Quizzes";
import Certificates from "./pages/Certificates";
import Events from "./pages/Events";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Navbar />
            <main className="p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/events" element={<Events />} />
                <Route path="*" element={<Login />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
