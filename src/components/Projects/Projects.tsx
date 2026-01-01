"use client";

import { useContext, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { LayoutContext } from "@/components/context";
import { FaGithub, FaInfoCircle, FaLink } from "react-icons/fa";
import Link from "next/link";
import { Project } from "@/types/translations";

type SortOption = "title-asc" | "title-desc" | "endtrac-asc" | "endtrac-desc";

const Projects = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
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

  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("endtrac-desc");

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (selectedTechs.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTechs.every((tech) =>
          p.techStack.toLowerCase().includes(tech.toLowerCase())
        )
      );
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
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="transition-colors duration-300"
    >
      {/* Header */}
      <div
        className={clsx(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4",
          isRTL ? "text-right" : "text-left"
        )}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
          <span className="text-sm text-orange-500 uppercase tracking-wide font-semibold">
            {projectsSection.projectsHeading || "Projects"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold flex-1">
          {projectsSection.AllProjects || "All Projects"}
        </h1>
      </div>

      {/* Filters and Sorting */}
      <div
        className={clsx(
          "flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 flex-wrap",
          isRTL ? "text-right" : "text-left"
        )}
      >
        <div className="flex flex-wrap gap-2 w-full sm:max-w-2xl">
          {techStacks.map((tech) => (
            <button
              key={tech}
              onClick={() => toggleTech(tech)}
              className={clsx(
                "px-3 py-1 rounded-full border text-sm transition-colors cursor-pointer",
                selectedTechs.includes(tech)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-transparent text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
              )}
            >
              {tech}
            </button>
          ))}
        </div>

        <div>
          <label
            htmlFor="sort"
            className="mr-2 font-semibold text-gray-700 dark:text-gray-300"
          >
            Sort By:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1"
          >
            <option value="endtrac-desc">End Date (Newest)</option>
            <option value="endtrac-asc">End Date (Oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div
        className={clsx(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
          isRTL ? "direction-rtl text-right" : "text-left"
        )}
      >
        {filteredProjects.map((item, idx) => (
          <div
            key={item.id}
            className="group relative bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col h-full"
          >
            <div className="flex flex-col grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate max-w-full">
                  {item.title}
                </h3>
                <span className="text-xs font-medium bg-orange-100 text-orange-600 dark:bg-orange-700 dark:text-orange-200 px-3 py-1 rounded-full select-none whitespace-nowrap">
                  {item.endtrac}
                </span>
              </div>

              {/* Images - responsive flex */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative w-full sm:w-2/3 h-40 rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={item.desktopimage}
                    alt={`${item.title} desktop`}
                    fill
                    className="object-cover"
                    priority={idx < 3}
                  />
                </div>
                <div className="relative w-full sm:w-1/3 h-40 rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={item.mobileimage}
                    alt={`${item.title} mobile`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 grow line-clamp-4">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.techStack
                  .split(",")
                  .map((tech) => tech.trim())
                  .map((tech) => (
                    <span
                      key={tech}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full select-none"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
            </div>

            {/* Footer icons */}
            <div className="flex justify-end gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href={`/projects/${item.id}`}
                className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
                aria-label={`Details about ${item.title}`}
              >
                <FaInfoCircle size={20} />
              </Link>
              {item.githubLink && (
                <Link
                  href={item.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  aria-label={`${item.title} GitHub repository`}
                >
                  <FaGithub size={20} />
                </Link>
              )}
              {item.liveLink && (
                <Link
                  href={item.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  aria-label={`${item.title} live site`}
                >
                  <FaLink size={20} />
                </Link>
              )}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
            No projects found for selected filters.
          </p>
        )}
      </div>
    </section>
  );
};

export default Projects;
