import ProjectDetailsClient from "@/components/Projects/ProjectsDetails";

const ProjectDetailsPage = () => {
  return (
    <div>
      <ProjectDetailsClient />
    </div>
  );
};

export default ProjectDetailsPage;

export const metadata = {
  title: "Rashaduldev | Project Details",
  description: "Detailed view of the selected project.",
};

export async function generateStaticParams() {
  const projectIds = ["1", "2", "3","4","5","6","7","8","9","10","11","12","13","14"];
  return projectIds.map((id) => ({ id }));
}
