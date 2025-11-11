import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="h-40 w-full object-cover mb-2 rounded" />}
      <h2 className="font-bold text-xl">{course.title}</h2>
      <p>{course.description}</p>
      <p className="mt-2 font-semibold">${course.price}</p>
      <Link to={`/courses/${course._id}`} className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded">View</Link>
    </div>
  );
};

export default CourseCard;
