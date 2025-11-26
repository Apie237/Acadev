import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 bg-gray-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <img 
              src={assets.logo} 
              alt="Acadevo Logo" 
              className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/courses" 
              className="text-[#1F2937] hover:text-[#48ADB7] font-medium transition-colors duration-200 relative group"
            >
              Courses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#48ADB7] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-[#1F2937] hover:text-[#48ADB7] font-medium transition-colors duration-200 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#48ADB7] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/contact" 
              className="text-[#1F2937] hover:text-[#48ADB7] font-medium transition-colors duration-200 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#48ADB7] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-[#1F2937] hover:text-[#48ADB7] font-semibold px-4 py-2 rounded-lg hover:bg-[#409891] transition-all duration-200"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white font-semibold px-6 py-2 rounded-lg hover:from-[#48ADB7] hover:to-[#409891] shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-[#1F2937] hover:bg-[#409891] transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3 bg-[#409891] border-t border-[#BAD0CC]/30">
          <Link 
            to="/courses" 
            className="block px-4 py-3 text-[#1F2937] hover:bg-[#48ADB7] hover:text-white rounded-lg font-medium transition-all duration-200"
            onClick={toggleMenu}
          >
            Courses
          </Link>
          <Link 
            to="/about" 
            className="block px-4 py-3 text-[#1F2937] hover:bg-[#48ADB7] hover:text-white rounded-lg font-medium transition-all duration-200"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="block px-4 py-3 text-[#1F2937] hover:bg-[#48ADB7] hover:text-white rounded-lg font-medium transition-all duration-200"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <div className="pt-3 border-t border-[#BAD0CC]/30 space-y-2">
            <Link 
              to="/login" 
              className="block px-4 py-3 text-center text-[#1F2937] hover:bg-[#2d6b66] rounded-lg font-semibold transition-all duration-200"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="block px-4 py-3 text-center bg-gradient-to-r from-[#48ADB7] to-[#409891] text-white rounded-lg font-semibold hover:from-[#409891] hover:to-[#48ADB7] shadow-md transition-all duration-200"
              onClick={toggleMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;