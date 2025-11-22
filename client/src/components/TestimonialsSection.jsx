import React from "react";
import { motion } from "framer-motion";
import { testimonialData } from "../assets/assets";

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">
          What Our Students Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg p-6 rounded-xl border border-gray-200"
            >
              <motion.img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 100 }}
              />

              <h3 className="text-lg font-semibold text-gray-700">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500">{item.role}</p>

              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                "{item.message}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
