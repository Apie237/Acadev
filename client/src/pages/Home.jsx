import React from "react";
import { useEffect, useState } from "react";
import Hero from "../components/Hero.jsx";
import api from "../utils/api.js";
import CourseSection from "../components/CourseSection.jsx";
import TestimonialsSection from "../components/TestimonialsSection.jsx";

const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Hero />
      <CourseSection/>
      <TestimonialsSection/>
    </>
  );
};

export default Home;
