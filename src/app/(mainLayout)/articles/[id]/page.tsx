import ArticleDetailsClient from "@/components/Articles/ArticlesDetails";

const ArticleDetailsPage = () => {
  return (
    <div>
      <ArticleDetailsClient />
    </div>
  );
};

export default ArticleDetailsPage;
export const metadata = {
  title: "Rashaduldev - Article Details",
  description: "Detailed view of the selected article.",
};

export async function generateStaticParams() {
  const projectIds = ["1", "2", "3"];
  return projectIds.map((id) => ({ id }));
}