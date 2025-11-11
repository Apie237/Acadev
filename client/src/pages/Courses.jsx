import React from "react";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard.jsx";
import api from "../utils/api.js";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {courses.map(course => <CourseCard key={course._id} course={course} />)}
    </section>
  );
};

export default Courses;
