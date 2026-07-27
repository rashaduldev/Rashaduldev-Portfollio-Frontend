"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  FaInfoCircle,
  FaGithub,
  FaExternalLinkAlt,
  FaArrowRight,
} from "react-icons/fa";
import { Project } from "@/types/translations";
import CelebrationButton from "../Common/CelebrationButton";

const EASE = [0.16, 1, 0.3, 1] as const;

export const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

const CHIP_CLASSES = [
  "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
];

function TechChips({ stack, max = 4 }: { stack: string; max?: number }) {
  const tags = stack
    .split(/[,|•·\/]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const shown = tags.slice(0, max);
  const extra = tags.length - shown.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((tag, i) => (
        <span
          key={tag}
          className={clsx(
            "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md",
            CHIP_CLASSES[i % CHIP_CLASSES.length],
          )}
        >
          {tag}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400">
          +{extra}
        </span>
      )}
    </div>
  );
}

function ActionBtn({
  href,
  label,
  icon,
  delay,
  hoverBackgroundClassName = "bg-primary",
  external = true,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  delay: string;
  hoverBackgroundClassName?: string;
  external?: boolean;
}) {
  return (
    <CelebrationButton
      className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/25"
      hoverBackgroundClassName={hoverBackgroundClassName}
    >
      <Link
        href={href}
        aria-label={label}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={clsx(
          "flex h-full w-full items-center justify-center rounded-full text-white",
          "hover:scale-110 group-hover:border-transparent",
          "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          delay,
        )}
      >
        {icon}
      </Link>
    </CelebrationButton>
  );
}

export interface ProjectCardProps {
  item: Project;
  index?: number;
  showIndex?: boolean;
  priority?: boolean;
}

export default function ProjectCard({
  item,
  index,
  showIndex = false,
  priority = false,
}: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.article
      variants={cardVariants}
      className={clsx(
        "group relative rounded-2xl flex flex-col h-full",
        "bg-white dark:bg-[var(--surface-dark)]",
        "border border-black/8 dark:border-white/10",
        "shadow-sm hover:shadow-2xl hover:shadow-primary/10",
        "transition-[box-shadow,border-color,transform] duration-500",
      )}
    >
      {/* ── Gradient glow border (unique signature) ── */}
      <div
        aria-hidden
        className={clsx(
          "pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100",
          "bg-gradient-to-br from-primary/40 via-violet-500/30 to-sky-500/40",
          "transition-opacity duration-500 -z-10 blur-[2px]",
        )}
      />

      {/* ── Corner accent diagonal stripe (unique signature) ── */}
      <span
        aria-hidden
        className={clsx(
          "absolute top-0 right-0 w-14 h-14 overflow-hidden rounded-tr-2xl pointer-events-none",
          "opacity-70 group-hover:opacity-100 transition-opacity duration-500",
        )}
      >
        <span className="absolute top-2 -right-6 rotate-45 w-20 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </span>

      {/* ── Image area ── */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-[var(--surface-dark-soft)]">
        {/* shimmer placeholder */}
        <div
          className={clsx(
            "absolute inset-0 bg-gradient-to-br from-gray-200/60 to-gray-100/30",
            "dark:from-white/5 dark:to-white/[0.02]",
            "transition-opacity duration-700",
            loaded ? "opacity-0" : "opacity-100",
          )}
        />

        <Image
          src={item.desktopimage}
          alt={item.title}
          fill
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          priority={priority}
          className={clsx(
            "object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover:scale-110",
            loaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setLoaded(true)}
        />

        {/* image → body gradient fade */}
        <div
          aria-hidden
          className={clsx(
            "absolute bottom-0 left-0 right-0 h-20 pointer-events-none",
            "bg-gradient-to-t from-white via-white/40 to-transparent",
            "dark:from-[var(--surface-dark)] dark:via-[var(--surface-dark-50)] dark:to-transparent",
          )}
        />

        {/* index badge (optional) */}
        {showIndex && typeof index === "number" && (
          <span
            className="absolute top-3 left-3 z-10 text-[11px] font-bold tracking-wider
                       text-white/95 bg-black/45 backdrop-blur-md
                       border border-white/15 rounded-md px-2 py-1"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        {/* status badge */}
        {item.status && (
          <div
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5
                       text-[9.5px] font-bold uppercase tracking-[.15em]
                       bg-white/85 dark:bg-black/60
                       text-violet-700 dark:text-violet-300
                       border border-violet-200 dark:border-violet-500/30
                       rounded-full px-2.5 py-1 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {item.status}
          </div>
        )}

        {/* hover overlay with action buttons */}
        <div
          className="absolute inset-0 z-20
                     opacity-0 group-hover:opacity-100
                     bg-gradient-to-t from-black/70 via-black/40 to-black/20
                     transition-opacity duration-400
                     flex items-center justify-center gap-3"
        >
          <ActionBtn
            href={`/projects/${item.id}`}
            label={`Details – ${item.title}`}
            icon={<FaInfoCircle size={15} />}
            delay="delay-0"
            hoverBackgroundClassName="bg-primary"
            external={false}
          />
          {item.githubLink && (
            <ActionBtn
              href={item.githubLink}
              label={`GitHub – ${item.title}`}
              icon={<FaGithub size={15} />}
              delay="delay-[60ms]"
              hoverBackgroundClassName="bg-gray-900"
            />
          )}
          {item.liveLink && (
            <ActionBtn
              href={item.liveLink}
              label={`Live – ${item.title}`}
              icon={<FaExternalLinkAlt size={13} />}
              delay="delay-[120ms]"
              hoverBackgroundClassName="bg-sky-500"
            />
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-4">
        {/* title with animated underline */}
        <h3
          className={clsx(
            "relative inline-block text-[15px] font-semibold leading-snug mb-2 line-clamp-1",
            "text-gray-900 dark:text-gray-100",
            "group-hover:text-primary dark:group-hover:text-primary",
            "transition-colors duration-300",
          )}
        >
          {item.title}
          <span
            aria-hidden
            className={clsx(
              "absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full",
              "bg-gradient-to-r from-primary to-transparent",
              "transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            )}
          />
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

        {/* footer */}
        <div
          className={clsx(
            "mt-auto pt-4 border-t flex items-center justify-between",
            "border-black/7 dark:border-white/8",
          )}
        >
          <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
            {item.endtrac}
          </span>
          <Link
            href={`/projects/${item.id}`}
            aria-label={`View details for ${item.title}`}
            className="group/btn inline-flex items-center gap-1.5 text-[11px] font-semibold
                       text-gray-500 dark:text-gray-400
                       hover:text-primary dark:hover:text-primary
                       transition-colors duration-200"
          >
            View details
            <FaArrowRight
              size={9}
              className="transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
