"use client";
import { useContext } from "react";
import { LayoutContext } from "./context";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { FaInfoCircle, FaGithub, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";

const ProjectsSection = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { translations, isRTL, language } = context;
  const projectsSection = translations.projectsSection || {};

  const statusMap: Record<string, string> = {
    en: "Latest",
    ar: "أحدث",
    bn: "সাম্প্রতিক",
  };

  const filteredStatus = statusMap[language] || "Latest";

  const projects = (projectsSection.projects || [])
    .filter((project) => project.status === filteredStatus)
    .slice(0, 6);

  return (
    <section className="py-16 mx-auto transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
        {/* Left Circle */}
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
          <span className="text-sm text-primary uppercase tracking-wide font-semibold">
            {projectsSection?.projectsHeading || "Projects"}
          </span>
        </div>

        {/* Center Heading */}
        <div className="text-center flex-1">
          <h2>
            {projectsSection?.trustedProjects || "Latest Projects"}
          </h2>
        </div>

        {/* Right Button */}
        <div className="text-right">
          <Link
            href="/projects"
            className="text-sm text-primary underline rounded-md transition"
          >
            {projectsSection?.viewallproject || "View All Projects"}
          </Link>
        </div>
      </div>

      <div
        className={clsx(
          "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
          isRTL ? "direction-rtl text-right" : "text-left"
        )}
      >
        {projects.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 100 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="group relative rounded shadow-md overflow-hidden transition-all hover:scale-105 hover:border-1 hover:border-[#fdfdfd5d] hover:shadow-lg min-h-[420px] flex flex-col"
          >
            <div className="absolute -bottom-10 -left-10 w-[150%] h-[150%] transform rotate-12 opacity-5 z-0">
              <Image
                src={item.desktopimage}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Hover Overlay with Animated Icons */}
            <div className="absolute inset-0 bg-black bg-opacity-40 z-50 transform -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-80 transition-all duration-900 ease-in-out flex items-center justify-center gap-6">
              <Link
                href={`/projects/${item.id}`}
                aria-label={`View details for ${item.title}`}
                className="text-gray-100 text-2xl transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500"
              >
                <FaInfoCircle />
              </Link>
              <Link
                href={item.githubLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${item.title} on GitHub`}
                className="text-gray-100 text-2xl transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-700"
              >
                <FaGithub />
              </Link>
              <Link
                href={item.liveLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit live site for ${item.title}`}
                className="text-gray-100 text-2xl transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-1000"
              >
                <FaLink />
              </Link>
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col justify-between h-full relative z-20">
              <div className="mb-4">
                <h3 className="text-lg">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm sm:text-base text-justify dark:text-gray-300">
                  {item.description}
                </p>
              </div>

              <div className="mt-auto flex justify-between items-center">
                <p className="text-primary font-semibold">{item.endtrac}</p>
                <p className="text-sm dark:text-gray-300">
                  {item.techStack.length > 30
                    ? item.techStack.slice(0, 30) + "..."
                    : item.techStack}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;