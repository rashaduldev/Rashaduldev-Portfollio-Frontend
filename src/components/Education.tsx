"use client";

import { useContext } from "react";
import { LayoutContext } from "./context";
import { CiSaveDown1 } from "react-icons/ci";
import { motion } from "framer-motion";
import { Typography } from "./ui/Typography";

export default function EducationSection() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }

  const { translations } = context;
  const educations = translations?.education || {};

  const sortedEducations = Object.entries(educations).sort((a, b) => {
    return Number(b[0]) - Number(a[0]);
  });

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-background">
      <h2 className="mb-12 ">{translations?.Educationheading}</h2>

      <motion.div
        className="relative flex flex-wrap items-start justify-between border-t-2 border-foreground gap-y-12"
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
              <CiSaveDown1 className="text-4xl text-muted-foreground transition duration-300 group-hover:scale-110" />
            </div>

            {/* Minimal Clean Card */}
            <div className="mt-6 border border-muted rounded-xl p-6 bg-transparent transform-gpu transition-transform duration-700 ease-out group-hover:rotate-x-0 group-hover:rotate-y-0 rotate-x-45 rotate-y-[5deg] translate-y-4 shadow-lg hover:border-primary">
              <Typography as="h3" size="sm" weight="bold" color="foreground">
                {year}
              </Typography>

              <Typography
                className="my-1"
                size="lg"
                weight="semiBold"
                color="foreground"
              >
                {edu.title}
              </Typography>
              {edu.company && (
                <Typography size="sm" color="foreground" className="my-2">
                  {edu.company}
                </Typography>
              )}
              {edu.department && (
                <Typography size="sm" color="primary" className="italic mt-2">
                  {edu.department}
                </Typography>
              )}
              {edu.description && (
                <Typography
                  size="sm"
                  color="muted_foreground"
                  className="mt-2 leading-relaxed"
                >
                  {edu.description}
                </Typography>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
