"use client";
import React, { useState, useContext, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { LayoutContext } from "./context";

type Skill = {
  key: string;
  category: "frontend" | "state_data" | "tools" | "backend";
};

const allSkills: Skill[] = [
  { key: "react", category: "frontend" },
  { key: "next", category: "frontend" },
  { key: "ts", category: "frontend" },
  { key: "js", category: "frontend" },
  { key: "tailwind", category: "frontend" },
  { key: "astro", category: "frontend" },
  { key: "html", category: "frontend" },
  { key: "css", category: "frontend" },
  { key: "restapi", category: "state_data" },
  { key: "redux", category: "state_data" },
  { key: "tanstackQuery", category: "state_data" },
  { key: "axios", category: "state_data" },
  { key: "postman", category: "tools" },
  { key: "swagger", category: "tools" },
  { key: "git", category: "tools" },
  { key: "vs", category: "tools" },
  { key: "figma", category: "tools" },
  { key: "node", category: "backend" },
  { key: "mongo", category: "backend" },
  { key: "firebase", category: "backend" },
  { key: "cloudinary", category: "backend" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.15 },
  },
};

export default function SkillsCloud() {
  const context = useContext(LayoutContext);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredSkills = useMemo(() => {
    if (activeFilter === "all") return allSkills;
    return allSkills.filter((skill) => skill.category === activeFilter);
  }, [activeFilter]);

  if (!context) return null;
  const { translations, isRTL } = context;

  const filters = [
    {
      id: "all",
      label: translations.skills.all || "All Stack",
      color: "bg-gray-400",
    },
    {
      id: "frontend",
      label: translations.skills.frontend || "Frontend",
      color: "bg-blue-500",
    },
    {
      id: "state_data",
      label: translations.skills.state_data || "State & API",
      color: "bg-orange-500",
    },
    {
      id: "tools",
      label: translations.skills.tools || "Tools",
      color: "bg-green-500",
    },
    {
      id: "backend",
      label: translations.skills.backend || "Backend",
      color: "bg-purple-500",
    },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full py-20 px-4 flex flex-col items-center"
    >
      <div className="text-center mb-10">
        <h2 className="mb-2">{translations.skills.about}</h2>
        <p className="text-gray-500 dark:text-zinc-400 max-w-lg mx-auto text-sm md:text-base">
          A specialized ecosystem of modern technologies focused on creating
          high-performance web solutions.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-200 dark:border-zinc-800">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
              activeFilter === f.id
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-5xl min-h-62.5 content-start"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              layout
              key={skill.key}
              variants={tagVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ scale: 1.08, y: -2 }}
              className="relative group"
            >
              <div className="px-6 py-3 rounded-2xl border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-3 transition-all duration-300 group-hover:border-primary group-hover:shadow-md">
                <span
                  className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${
                    skill.category === "frontend"
                      ? "bg-blue-500"
                      : skill.category === "state_data"
                        ? "bg-orange-500"
                        : skill.category === "tools"
                          ? "bg-green-500"
                          : "bg-purple-500"
                  }`}
                />
                <span className="text-sm md:text-base font-bold dark:text-zinc-200">
                  {translations.skills[skill.key] || skill.key.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="mt-10 w-full max-w-4xl mx-auto pt-8 dark:border-zinc-800/50 flex flex-col md:flex-row justify-center items-center gap-6 opacity-60">
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          {filters.slice(1).map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-2 group cursor-help"
            >
              <span
                className={`w-2 h-2 rounded-full ${f.color} group-hover:animate-pulse`}
              />
              <span className="group-hover:text-primary transition-colors">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
