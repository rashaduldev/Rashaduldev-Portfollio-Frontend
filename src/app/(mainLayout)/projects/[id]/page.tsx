import { cache } from "react";
import type { Metadata } from "next";
import ProjectDetailsClient from "@/components/Projects/ProjectsDetails";
import JsonLd from "@/components/Seo/JsonLd";
import { getProjectById } from "@/actions/projects/projects";
import { createPageMetadata, SITE_URL } from "@/lib/seo";
import defaultTranslations from "@/app/translations/defaultTranslations";

const isTranslationProjectId = (id: string) => /^\d+$/.test(id);
const findTranslationProject = (id: string) =>
  defaultTranslations.projectsSection.projects.find((project) => String(project.id) === id);
const loadProject = cache(async (id: string) => {
  if (isTranslationProjectId(id)) return null;
  return (await getProjectById(id)).payload;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const managedProject = await loadProject(id);
  const staticProject = findTranslationProject(id);
  const title = managedProject?.title ?? staticProject?.title;
  const description = managedProject?.description ?? staticProject?.description;
  const keywords = managedProject?.techStack ?? staticProject?.techStack.split(", ");
  return createPageMetadata({ title: title ?? "Project", description: description ?? "Portfolio project details.", path: `/projects/${id}`, keywords });
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await loadProject(id);
  const staticProject = findTranslationProject(id);
  const schemaProject = project ?? (staticProject ? {
    title: staticProject.title,
    description: staticProject.description,
    githubUrl: staticProject.githubLink,
    liveUrl: staticProject.liveLink,
  } : null);
  return <>
    {schemaProject && <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: schemaProject.title, description: schemaProject.description, url: `${SITE_URL}/projects/${id}`, applicationCategory: "WebApplication", operatingSystem: "Web", sameAs: [schemaProject.githubUrl, schemaProject.liveUrl].filter(Boolean) }} />}
    <ProjectDetailsClient projectId={id} initialProject={project} />
  </>;
}
