import ProjectDetailsClient from "@/components/Projects/ProjectsDetails";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({ params }: Props) {
  const resolvedParams = await params;

  return <ProjectDetailsClient projectId={resolvedParams.id} />;
}

// Metadata
export const metadata = {
  title: "Rashaduldev - Project Details",
  description: "Detailed view of the selected project.",
};

// SSG static params
export async function generateStaticParams() {
  const projectIds = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
  ];

  return projectIds.map((id) => ({ id }));
}