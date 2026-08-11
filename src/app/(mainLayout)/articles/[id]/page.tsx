import ArticleDetailsClient from "@/components/Articles/ArticlesDetails";
import { getArticleById, getRelatedArticles } from "@/actions/articles/articles";

const ArticleDetailsPage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;

  let initialArticle = null;
  try {
    const res = await getArticleById(id);
    initialArticle = res.payload ?? null;
  } catch (error) {
    console.error("Failed to load article:", error);
    initialArticle = null;
  }
  let related = [];
  if (initialArticle && (initialArticle as any).slug) {
    try {
      const relatedRes = await getRelatedArticles((initialArticle as any).slug);
      related = relatedRes.payload ?? [];
    } catch (err) {
      console.error("Failed to load related articles:", err);
    }
  }

  return (
    <div>
      {/* pass id, initialArticle and related articles to the client component */}
      <ArticleDetailsClient id={id} initialArticle={initialArticle} relatedArticles={related} />
    </div>
  );
};

export default ArticleDetailsPage;
export const metadata = {
  title: "Rashaduldev - Article Details",
  description: "Detailed view of the selected article.",
};