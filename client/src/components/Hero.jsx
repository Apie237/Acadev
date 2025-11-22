import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-[#E6E5E1] text-gray-900 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#409891]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#48ADB7]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#BAD0CC]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        
        {/* LEFT TEXT */}
        <div className="flex-1 text-center md:text-left z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#409891]/20 border border-[#409891]/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
          >
            <Sparkles size={16} className="text-[#409891]" />
            <span className="text-sm font-semibold text-[#2d6b66]">Empowering African Tech Talent</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-[#2d6b66]"
          >
            Transform Your Future with{" "}
            <span className="bg-gradient-to-r from-[#409891] to-[#48ADB7] bg-clip-text text-transparent">
              Tech Skills
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed"
          >
            Join thousands of African learners mastering in-demand tech skills through hands-on projects, 
            expert-led courses, and a supportive community.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <button className="group bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-[#409891]/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-[#BAD0CC]/30 backdrop-blur-sm border-2 border-[#409891]/40 text-[#2d6b66] px-8 py-4 rounded-xl font-bold hover:bg-[#BAD0CC]/50 hover:border-[#409891]/60 transition-all duration-300 flex items-center justify-center gap-2">
              <PlayCircle size={20} />
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex flex-wrap gap-8 justify-center md:justify-start"
          >
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-[#409891]">10,000+</p>
              <p className="text-sm text-gray-600">Active Students</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-[#409891]">50+</p>
              <p className="text-sm text-gray-600">Expert Courses</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-[#409891]">95%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT IMAGE / ILLUSTRATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex-1 flex justify-center relative z-10"
        >
          <div className="relative">
            {/* Decorative rings */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#409891]/20 to-[#48ADB7]/20 rounded-full blur-2xl scale-110"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#409891]/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#BAD0CC]/40 rounded-full blur-xl animate-pulse delay-700"></div>
            
            {/* Main Image */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop"
              alt="African students learning tech"
              className="relative w-[400px] md:w-[500px] rounded-3xl shadow-2xl shadow-[#409891]/20 transform hover:scale-105 transition-transform duration-500"
            />
            
            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -top-6 -left-6 bg-white text-[#2d6b66] px-4 py-3 rounded-xl shadow-xl"
            >
              <p className="text-sm font-bold">🔥 Trending</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#409891] to-[#48ADB7] text-white px-6 py-3 rounded-xl shadow-2xl"
            >
              <p className="text-sm font-bold">⭐ 4.9 Rating</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#BAD0CC" fillOpacity="0.2"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero