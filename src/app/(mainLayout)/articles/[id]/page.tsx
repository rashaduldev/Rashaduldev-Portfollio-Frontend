import ArticleDetailsClient from "@/components/Articles/ArticlesDetails";
import { getArticleById, getRelatedArticles } from "@/actions/articles/articles";

const ArticleDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  let initialArticle = null;
  try {
    const res = await getArticleById(id);
    const article = res.payload as any;
    initialArticle = article ? {
      ...article,
      id: article._id,
      imageUrl: article.coverImage?.url ?? "https://placehold.co/1200x720/png?text=Article",
      date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "",
    } : null;
  } catch (error) {
    console.error("Failed to load article:", error);
    initialArticle = null;
  }
  let related = [];
  if (initialArticle && (initialArticle as any).slug) {
    try {
      const relatedRes = await getRelatedArticles((initialArticle as any).slug);
      related = Array.isArray(relatedRes.payload) ? relatedRes.payload.map((article: any) => ({
        ...article,
        id: article._id,
        imageUrl: article.coverImage?.url ?? "https://placehold.co/1200x720/png?text=Article",
        date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "",
      })) : [];
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
