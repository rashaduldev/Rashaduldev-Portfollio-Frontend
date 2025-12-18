"use client";

import { useContext } from "react";
import { LayoutContext } from "./context";
import { motion } from "framer-motion";
import { ExperienceItem } from "@/types/translations";
import { CiLocationOn } from "react-icons/ci";

export default function WorkExperience() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { translations, isRTL } = context;
  const experienceRecord:  ExperienceItem[] =
    translations?.experience ?? {};
  const experiences: ExperienceItem[] =
    Object.values(experienceRecord).flat();

  // Sort by year desc
  const sortedExperiences = [...experiences].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  return (
    <section className="w-full py-12 overflow-x-hidden">
      <h2 className="text-center mb-12">
        {translations.experienceHeading}
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div
          className={`absolute top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-600 ${
            isRTL
              ? "right-0 md:right-1/2 md:translate-x-1/2"
              : "left-0 md:left-1/2 md:-translate-x-1/2"
          }`}
        />

        <div className="flex flex-col space-y-1 relative z-10">
          {sortedExperiences.map((exp, index) => {
            const isLeft = index % 2 === 0;
            const alignLeft = (!isRTL && isLeft) || (isRTL && !isLeft);
            const animationX = alignLeft ? -40 : 40;

            return (
              <div
                key={`${exp.year}-${index}`}
                className={`relative flex flex-col md:flex-row ${
                  alignLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Dot */}
                <div className="absolute hidden md:block left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700 z-10" />

                <div className="w-full md:w-1/2 px-4">
                  <motion.div
                    initial={{ opacity: 0, x: animationX }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="p-6 border rounded-lg hover:shadow-lg transition">
                      <div className="flex items-center justify-between">
                        <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-800">
                        {exp.year}
                      </span>
                      <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full  dark:bg-gray-800 bg-primary text-white">
                        {exp.type}
                      </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg">
                          {exp.title}
                        </p>
                        <div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <CiLocationOn />
                          {exp.location}
                        </p>
                          <p className="text-sm text-gray-500">
                          {exp.duration}
                        </p>
                        </div>
                      </div>

                      <p className="font-medium">{exp.company}</p>
                      <p className="text-sm">{exp.department}</p>
                      <p className="text-xs mt-1">
                        {exp.type} · {exp.location}
                      </p>

                      <p className="text-sm mt-2">
                        {exp.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
