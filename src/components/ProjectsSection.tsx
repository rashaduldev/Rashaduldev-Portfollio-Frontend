"use client";

import { useContext, useState } from "react";
import { LayoutContext } from "./context";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { FaInfoCircle, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

/* ─── Easing ──────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

/* ─── Tech Chips ──────────────────────────────────────────── */
const CHIP_CLASSES = [
  "bg-primary/30 text-black/60 dark:bg-primary dark:text-primary/30",
  "bg-sky-100    text-sky-800    dark:bg-sky-500/15    dark:text-sky-300",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
];

function TechChips({ stack }: { stack: string }) {
  const tags = stack
    .split(/[,|•·\/]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={tag}
          className={clsx(
            "text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
            CHIP_CLASSES[i % CHIP_CLASSES.length],
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ─── Hover Action Button ─────────────────────────────────── */
function ActionBtn({
  href,
  label,
  icon,
  delay,
  external = true,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  delay: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={clsx(
        "flex items-center justify-center w-9 h-9 rounded-full",
        "hover:bg-primary/70",
        "bg-white/10 border border-white/20 text-white",
        "translate-y-2.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
        "transition-all duration-450 ease-[cubic-bezier(0.16,1,0.3,1)]",
        delay,
      )}
    >
      {icon}
    </Link>
  );
}

/* ─── Project Card ────────────────────────────────────────── */
function ProjectCard({ item }: { item: any }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -10,
        transition: { type: "spring", stiffness: 260, damping: 22 },
      }}
      className={clsx(
        "group relative rounded-[18px] overflow-hidden flex flex-col",
        /* Light */
        "bg-white border border-black/8",
        "hover:border-primary",
        /* Dark */
        "dark:bg-[#17171d] dark:border-white/8",
        "dark:hover:border-white/18",
        /* Shared */
        "transition-[box-shadow,border-color,transform] duration-500",
        "min-h-100",
      )}
    >
      {/* ── Image ── */}
      <div className="relative h-44 w-full overflow-hidden shrink-0 bg-gray-100 dark:bg-[#1f1f27]">
        {/* Shimmer */}
        <div
          className={clsx(
            "absolute inset-0 bg-linear-to-br from-gray-200/60 to-gray-100/30",
            "dark:from-white/5 dark:to-white/2",
            "transition-opacity duration-700",
            loaded ? "opacity-0" : "opacity-100",
          )}
        />

        {/* Actual image */}
        <Image
          src={item.desktopimage}
          alt={item.title}
          fill
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          className={clsx(
            "object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            loaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setLoaded(true)}
        />

        {/* Gradient — image → card body */}
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0 h-24 pointer-events-none",
            "bg-linear-to-t from-white via-white/50 to-transparent",
            "dark:from-[#17171d] dark:via-[#17171d]/60 dark:to-transparent",
          )}
        />

        {/* Status badge */}
        {item.status && (
          <div
            className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5
                          text-[9px] font-bold uppercase tracking-[.15em]
                          bg-white/80 dark:bg-black/60
                          text-violet-700 dark:text-violet-300
                          border border-violet-200 dark:border-violet-500/30
                          rounded-full px-2.5 py-1 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {item.status}
          </div>
        )}

        {/* Action overlay */}
        <div
          className="absolute inset-0 z-20
                     opacity-0 group-hover:opacity-100
                     bg-black/30 dark:bg-black/45
                     transition-opacity duration-300
                     flex items-center justify-center gap-2.5"
        >
          <ActionBtn
            href={`/projects/${item.id}`}
            label={`Details – ${item.title}`}
            icon={<FaInfoCircle size={14} />}
            delay="delay-0"
            external={false}
          />
          <ActionBtn
            href={item.githubLink || "#"}
            label={`GitHub – ${item.title}`}
            icon={<FaGithub size={14} />}
            delay="delay-[50ms]"
          />
          <ActionBtn
            href={item.liveLink || "#"}
            label={`Live – ${item.title}`}
            icon={<FaExternalLinkAlt size={12} />}
            delay="delay-[100ms]"
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-4">
        <h3
          className={clsx(
            "text-[14.5px] font-semibold leading-snug mb-1.5 line-clamp-1",
            "text-gray-900 dark:text-gray-100",
            "group-hover:text-primary dark:group-hover:text-violet-300",
            "transition-colors duration-300",
          )}
        >
          {item.title}
        </h3>

        <p
          className={clsx(
            "text-[12.5px] leading-relaxed line-clamp-3 mb-4",
            "text-gray-500 dark:text-gray-400",
            "group-hover:text-gray-700 dark:group-hover:text-gray-300",
            "transition-colors duration-300",
          )}
        >
          {item.description}
        </p>

        <TechChips stack={item.techStack} />

        {/* Footer */}
        <div
          className={clsx(
            "mt-auto pt-3.5 border-t flex items-center justify-between",
            "border-black/7 dark:border-white/7",
          )}
        >
          <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
            {item.endtrac}
          </span>
          <Link
            href={`/projects/${item.id}`}
            className="flex items-center gap-1 text-[10.5px]
                       text-gray-400 dark:text-gray-500
                       hover:text-violet-600 dark:hover:text-violet-400
                       transition-colors duration-200"
          >
            View details
            <FaExternalLinkAlt size={8} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Section ─────────────────────────────────────────────── */
const ProjectsSection = () => {
  const context = useContext(LayoutContext);
  if (!context)
    throw new Error("LayoutContext must be within a LayoutContext.Provider");

  const { translations, isRTL, language } = context;
  const ps = translations.projectsSection || {};

  const statusMap: Record<string, string> = {
    en: "Latest",
    ar: "أحدث",
    bn: "সাম্প্রতিক",
  };
  const filteredStatus = statusMap[language] || "Latest";

  const projects = (ps.projects || [])
    .filter((p: any) => p.status === filteredStatus)
    .slice(0, 6);

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
        {/* Label */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[.2em] text-primary dark:text-primary">
            {ps.projectsHeading || "Projects"}
          </span>
        </div>

        {/* Title */}
        <h2 className="flex-1 text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {ps.trustedProjects || "Latest Projects"}
        </h2>

        {/* View all */}
        <div className={clsx("shrink-0", isRTL ? "text-left" : "text-right")}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium
                       text-primary dark:text-primary hover:underline
                       hover:opacity-75 transition-opacity duration-200"
          >
            {ps.viewallproject || "View All Projects"}
            <FaExternalLinkAlt size={9} />
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
        {projects.map((item: any, idx: number) => (
          <ProjectCard key={item.id ?? idx} item={item} />
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
