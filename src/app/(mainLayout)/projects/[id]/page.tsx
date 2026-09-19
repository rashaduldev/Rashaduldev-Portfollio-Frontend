import { cache } from "react";
import type { Metadata } from "next";
import ProjectDetailsClient from "@/components/Projects/ProjectsDetails";
import JsonLd from "@/components/Seo/JsonLd";
import { getProjectById } from "@/actions/projects/projects";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

const loadProject = cache(async (id: string) => (await getProjectById(id)).payload);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await loadProject(id);
  if (!project) return createPageMetadata({ title: "Project", description: "Portfolio project details.", path: `/projects/${id}` });
  return createPageMetadata({ title: project.title, description: project.description, path: `/projects/${id}`, keywords: project.techStack });
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await loadProject(id);
  return <>
    {project && <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: project.title, description: project.description, url: `${SITE_URL}/projects/${id}`, applicationCategory: "WebApplication", operatingSystem: "Web", sameAs: [project.githubUrl, project.liveUrl].filter(Boolean) }} />}
    <ProjectDetailsClient projectId={id} initialProject={project} />
  </>;
}
