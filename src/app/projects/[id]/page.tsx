// app/projects/[id]/page.tsx
// import ProjectDetailsClient from "@/components/Projects/ProjectDetailsClient";

import ProjectDetailsClient from "@/components/Projects/ProjectsDetails";

// Page component – no explicit type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectDetailsPage({ params }: any) {
  return <ProjectDetailsClient projectId={params.id} />;
}

// Metadata
export const metadata = {
  title: "Rashaduldev | Project Details",
  description: "Detailed view of the selected project.",
};

// SSG static params
export async function generateStaticParams() {
  const projectIds = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14"];
  return projectIds.map((id) => ({ id }));
}
