import React from "react";
const Testimonial = ({ message, name, role, image }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full object-cover mb-4"
      />

      <p className="text-gray-700 italic mb-4">"{message}"</p>

      <h3 className="font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );
};

export default Testimonial;
