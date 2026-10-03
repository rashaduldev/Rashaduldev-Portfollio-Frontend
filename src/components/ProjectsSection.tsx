"use client";

import { useContext } from "react";
import { LayoutContext } from "./context";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "./Projects/ProjectCard";
import defaultTranslations from "@/app/translations/defaultTranslations";
import type { Project } from "@/types/translations";

const EASE = [0.16, 1, 0.3, 1] as const;
const FEATURED_PROJECT_IDS = [13, 19, 5, 21, 14, 16, 20, 15] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const ProjectsSection = () => {
  const context = useContext(LayoutContext);
  if (!context)
    throw new Error("LayoutContext must be within a LayoutContext.Provider");

  const { translations, isRTL } = context;
  const ps = translations.projectsSection || {};

  const localizedProjects = (ps.projects || []) as Project[];
  const canonicalProjects = defaultTranslations.projectsSection.projects;
  const projects = FEATURED_PROJECT_IDS.flatMap((id) => {
    const canonical = canonicalProjects.find((project) => project.id === id);
    const localized = localizedProjects.find((project) => project.id === id);

    if (!canonical) return [];
    return localized?.githubLink === canonical.githubLink ? localized : canonical;
  });

  return (
    <section
      className={clsx(
        "relative py-24 mx-auto overflow-hidden",
        isRTL && "direction-rtl",
      )}
    >
      {/* Ambient glow — adapts in dark mode */}
      <div
        aria-hidden
        className={clsx(
          "pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10",
          "w-200 h-120 rounded-full blur-[140px]",
        )}
      />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-4"
      >
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-primary dark:text-primary">
            {ps.projectsHeading || "Projects"}
          </span>
        </div>

        <h2>
          {ps.trustedProjects || "Latest Projects"}
        </h2>

        <div className={clsx("shrink-0", isRTL ? "text-left" : "text-right")}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium
                       text-primary dark:text-primary hover:underline
                       hover:opacity-75 transition-opacity duration-200 underline"
          >
            {ps.viewallproject || "View All Projects"}
          </Link>
        </div>
      </motion.div>

      {/* ── Cards ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((item, idx) => (
          <ProjectCard
            key={item.id ?? idx}
            item={item}
            index={idx}
            priority={idx < 3}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
