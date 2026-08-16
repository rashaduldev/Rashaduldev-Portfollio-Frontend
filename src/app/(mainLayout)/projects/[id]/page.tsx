import ProjectDetailsClient from "@/components/Projects/ProjectsDetails";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProjectDetailsClient projectId={(await params).id} />;
}
