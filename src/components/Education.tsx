"use client";

import { useContext } from "react";
import { LayoutContext } from "./context";
import { CiSaveDown1 } from "react-icons/ci";
import { motion } from "framer-motion";

export default function Timeline() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { translations } = context;
  const educations = translations?.education || {};

  const sortedEducations = Object.entries(educations).sort((a, b) => {
    return Number(b[0]) - Number(a[0]);
  });

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white dark:bg-[#05070C]">
      <h2 className="mb-12 text-3xl font-bold text-gray-900 text-start md:text-4xl dark:text-white">
        {translations.Educationheading}
      </h2>

      <motion.div
        className="relative flex flex-wrap items-start justify-between border-t-2 border-black dark:border-white gap-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {sortedEducations.map(([year, edu], index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
            className="relative w-full sm:w-1/2 md:w-1/3 xl:w-1/4 px-4 group perspective-[1000px]"
          >
            {/* Icon */}
            <div className="flex justify-center">
              <CiSaveDown1 className="text-4xl text-gray-700 transition duration-300 dark:text-gray-200 group-hover:scale-110" />
            </div>

            {/* Minimal Clean Card */}
            <div
              className="mt-6 border border-gray-300 dark:border-gray-700 rounded-xl p-6 min-h-[280px] bg-transparent transform-gpu transition-transform duration-700 ease-out group-hover:rotate-x-0 group-hover:rotate-y-0 rotate-x-[45deg] rotate-y-[5deg] translate-y-4 shadow-lg"
            >
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-400">{year}</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {edu.title}
              </p>
              {edu.company && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {edu.company}
                </p>
              )}
              {edu.department && (
                <p className="text-sm italic text-yellow-600 dark:text-yellow-300">
                  {edu.department}
                </p>
              )}
              {edu.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                  {edu.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
