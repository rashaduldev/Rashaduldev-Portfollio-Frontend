"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { LayoutContext } from "../context";
import ContentEngagement from "../Engagement/ContentEngagement";
import ProjectDetailsHero from "./ProjectDetailsHero";
import ProjectCaseStudyView from "./ProjectCaseStudyView";
import { getProjectCaseStudy } from "@/lib/projectCaseStudies";
import type { Project as StaticProject } from "@/types/translations";
import type { ManagedProject } from "@/types/project";

interface Props { projectId: string; initialProject: ManagedProject | null; staticProject?: StaticProject }

export default function ProjectDetailsClient({ projectId, initialProject, staticProject }: Props) {
  const context = useContext(LayoutContext);
  const fallback = context?.translations.projectsSection?.projects.find((item: StaticProject) => String(item.id) === projectId) ?? staticProject;
  const project = initialProject ?? (fallback ? {
    title: fallback.title, description: fallback.description,
    techStack: fallback.techStack.split(",").map((item) => item.trim()).filter(Boolean),
    images: [{ url: fallback.desktopimage }, { url: fallback.mobileimage }],
    githubUrl: fallback.githubLink, liveUrl: fallback.liveLink,
    likes: 0, comments: [],
  } : null);

  if (!project) return <div className="mx-auto mt-32 min-h-screen max-w-5xl px-4 text-center"><h1 className="text-3xl font-bold">Project not found</h1><p className="mt-3 text-muted-foreground">The requested project is not available.</p></div>;

  const technologies = project.techStack ?? [];
  const images = [...new Set((project.images ?? []).map((image) => image.url).filter(Boolean))];
  const study = getProjectCaseStudy(projectId, project.title, project.description, technologies);
  const share = async () => {
    if (navigator.share) await navigator.share({ title: project.title, url: window.location.href });
    else { await navigator.clipboard.writeText(window.location.href); toast.success("Project link copied."); }
  };
  const actionClass = "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg";

  return <main className="mx-auto min-h-screen max-w-7xl px-3 pb-24 pt-6 sm:px-5 lg:pt-10">
    <ProjectDetailsHero title={project.title} description={project.description} category={study.category} image={images[0]} technologies={technologies} actions={<>
      {project.liveUrl && <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={actionClass}><ExternalLink className="h-4 w-4" /> Live project</Link>}
      {project.githubUrl && project.githubUrl !== "#private" && <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary"><Github className="h-4 w-4" /> Source code</Link>}
      <button type="button" onClick={share} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary"><Share2 className="h-4 w-4" /> Share</button>
    </>} />

    <ProjectCaseStudyView study={study} title={project.title} description={project.description} />

    {images.length > 1 && <section className="mt-20"><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-primary">Responsive showcase</p><h2 className="mb-7 text-3xl font-black">More project views</h2><div className="grid gap-5 sm:grid-cols-2">{images.slice(1).map((image, index) => <div key={image} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted"><Image fill src={image} alt={`${project.title} responsive view ${index + 2}`} sizes="(max-width: 640px) 100vw, 50vw" className="object-cover object-top" /></div>)}</div></section>}

    <section className="mt-20 rounded-[2rem] border border-border bg-card p-6 text-center sm:p-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Have a similar idea?</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black">Let&apos;s turn your requirements into a polished digital product.</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">I can help with interface architecture, responsive frontend development, performance, integration and production delivery.</p><Link href="/contact" className={`${actionClass} mt-6`}>Start a conversation <ExternalLink className="h-4 w-4" /></Link></section>

    <ContentEngagement resource="projects" resourceId={projectId} initialLikes={project.likes} initialComments={project.comments} />
  </main>;
}
