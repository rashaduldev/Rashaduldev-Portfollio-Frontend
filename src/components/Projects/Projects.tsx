"use client";

import { useContext, useMemo, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { LayoutContext } from "@/components/context";
import { Project } from "@/types/translations";
import ProjectCard from "./ProjectCard";

type SortOption = "title-asc" | "title-desc" | "endtrac-asc" | "endtrac-desc";

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const normalizeTech = (tech: string) => tech.trim().toLocaleLowerCase();

const getProjectTechs = (techStack: string) =>
  techStack
    .split(",")
    .map(normalizeTech)
    .filter(Boolean);

const Projects = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }

  const { translations, isRTL } = context;
  const projectsSection = translations.projectsSection || {};

  const projects: Project[] = useMemo(() => {
    return (projectsSection.projects || []) as Project[];
  }, [projectsSection.projects]);

  const techStacks = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.techStack) {
        p.techStack.split(",").forEach((t) => set.add(t.trim()));
      }
    });
    return Array.from(set).sort();
  }, [projects]);

  // Store normalized values so toggling is unaffected by casing or whitespace
  // differences in project data.
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(
    () => new Set(),
  );
  const [sortBy, setSortBy] = useState<SortOption>("endtrac-desc");

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (selectedTechs.size > 0) {
      filtered = filtered.filter((p) => {
        const projectTechs = new Set(getProjectTechs(p.techStack));
        return Array.from(selectedTechs).every((tech) => projectTechs.has(tech));
      });
    }

    filtered.sort((a, b) => {
      if (sortBy.startsWith("title")) {
        const cmp = a.title.localeCompare(b.title);
        return sortBy === "title-asc" ? cmp : -cmp;
      } else if (sortBy.startsWith("endtrac")) {
        const dateA = new Date(a.endtrac);
        const dateB = new Date(b.endtrac);
        return sortBy === "endtrac-asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });

    return filtered;
  }, [projects, selectedTechs, sortBy]);

  const toggleTech = (tech: string) => {
    const normalizedTech = normalizeTech(tech);

    setSelectedTechs((previous) => {
      const next = new Set(previous);

      if (next.has(normalizedTech)) {
        next.delete(normalizedTech);
      } else {
        next.add(normalizedTech);
      }

      return next;
    });
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="transition-colors duration-300"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={clsx(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4",
          isRTL ? "text-right" : "text-left",
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[.2em] text-primary">
            {projectsSection.projectsHeading || "Projects"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex-1">
          {projectsSection.AllProjects || "All Projects"}
        </h1>
      </motion.div>

      {/* Filters and Sorting */}
      <div
        className={clsx(
          "flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4 flex-wrap",
          isRTL ? "text-right" : "text-left",
        )}
      >
        <div className="flex flex-wrap gap-2 w-full sm:max-w-2xl">
          {techStacks.map((tech) => {
            const active = selectedTechs.has(normalizeTech(tech));
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                aria-pressed={active}
                className={clsx(
                  "px-3 py-1 rounded-full border text-[12px] font-medium transition-all duration-200 cursor-pointer",
                  active
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/30"
                    : "bg-transparent text-primary border-primary/40 hover:bg-primary hover:text-white hover:border-primary",
                )}
              >
                {tech}
              </button>
            );
          })}
          {selectedTechs.size > 0 && (
            <button
              type="button"
              onClick={() => setSelectedTechs(new Set())}
              className="px-3 py-1 rounded-full border border-gray-300 dark:border-white/20 text-[12px] font-medium text-gray-600 dark:text-gray-300 transition-colors hover:border-primary hover:text-primary"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-[12px] font-semibold text-gray-700 dark:text-gray-300"
          >
            Sort By:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[var(--surface-dark)] text-gray-800 dark:text-gray-200 px-3 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="endtrac-desc">End Date (Newest)</option>
            <option value="endtrac-asc">End Date (Oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div
        // Changing filters can mount cards that were previously hidden. Remount
        // the stagger container so every visible card receives its "show" state.
        key={filteredProjects.map((project) => project.id).join("-") || "empty"}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={clsx(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
          isRTL ? "direction-rtl text-right" : "text-left",
        )}
      >
        {filteredProjects.map((item, idx) => (
          <ProjectCard
            key={item.id}
            item={item}
            index={idx}
            showIndex
            priority={idx < 3}
          />
        ))}

        {filteredProjects.length === 0 && (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400 py-16">
            No projects found for selected filters.
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;
