"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLink, FaShareAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { LayoutContext } from "../context";
import ContentEngagement from "../Engagement/ContentEngagement";
import type { Project as StaticProject } from "@/types/translations";
import type { ManagedProject } from "@/types/project";
interface ProjectDetailsClientProps { projectId: string; initialProject: ManagedProject | null }

export default function ProjectDetailsClient({ projectId, initialProject }: ProjectDetailsClientProps) {
  const context = useContext(LayoutContext);
  const fallbackProject = context?.translations.projectsSection?.projects.find((item: StaticProject) => String(item.id) === projectId);
  const share = async () => {
    if (navigator.share) await navigator.share({ title: initialProject?.title ?? fallbackProject?.title, url: window.location.href });
    else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied to clipboard."); }
  };

  const displayedProject = initialProject ?? (fallbackProject ? { _id: "", title: fallbackProject.title, description: fallbackProject.description, techStack: fallbackProject.techStack.split(", "), images: [{ url: fallbackProject.desktopimage }, { url: fallbackProject.mobileimage }], githubUrl: fallbackProject.githubLink, liveUrl: fallbackProject.liveLink } : null);
  if (!displayedProject) return <div className="mt-24 text-center">Project not found.</div>;
  const displayed = displayedProject;
  const images = displayed.images ?? [];
  return <div className="max-w-5xl md:mx-auto mx-3 min-h-screen">
    <h1 className="text-3xl font-bold mb-4">{displayed.title}</h1><p className="text-gray-700 dark:text-gray-300 mb-4">{displayed.description}</p>
    {!!displayed.techStack?.length && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{displayed.techStack.join(", ")}</p>}
    {!!images.length && <div className="grid gap-6 sm:grid-cols-2 mb-10">{images.map((image, index) => <div key={image.url} className="relative h-64"><Image fill src={image.url} alt={`${displayed.title} screenshot ${index + 1}`} sizes="(max-width: 640px) 100vw, 50vw" className="rounded-lg object-cover" /></div>)}</div>}
    <div className="flex gap-6 items-center mb-8">{displayed.githubUrl && <Link href={displayed.githubUrl} target="_blank"><FaGithub size={20} /></Link>}{displayed.liveUrl && <Link href={displayed.liveUrl} target="_blank"><FaLink size={20} /></Link>}<button onClick={share} aria-label="Share project"><FaShareAlt size={20} /></button></div>
    <ContentEngagement resource="projects" resourceId={projectId} initialLikes={displayed.likes} initialComments={displayed.comments} />
  </div>;
}
