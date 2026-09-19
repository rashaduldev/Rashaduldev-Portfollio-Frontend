import type { Metadata } from "next";
import ArticleDetailsClient from "@/components/Articles/ArticlesDetails";
import { getArticleById, getRelatedArticles } from "@/actions/articles/articles";
import defaultTranslations from "@/app/translations/defaultTranslations";
import { createPageMetadata } from "@/lib/seo";

interface BackendArticle {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  content?: string;
  likes?: number;
  comments?: Array<{ _id?: string; name: string; content: string; createdAt: string }>;
  coverImage?: { url?: string };
  publishedAt?: string;
  user?: { name?: string; bio?: string };
}

const isTranslationArticle = (id: string) => /^\d+$/.test(id);
const mapArticle = (article: BackendArticle) => ({
  ...article,
  id: article._id,
  category: article.category ?? "Article",
  imageUrl: article.coverImage?.url ?? "https://placehold.co/1200x720/png?text=Article",
  date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "",
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = defaultTranslations.latestArticlesSection.articles.find((item) => String(item.id) === id);
  return createPageMetadata({
    title: article?.title ?? "Article Details",
    description: article?.description ?? "Read portfolio development articles and insights.",
    path: `/articles/${id}`,
    keywords: article ? [article.category, "web development", "frontend"] : undefined,
  });
}

export default async function ArticleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Translation-backed articles use numeric IDs and are resolved by the locale
  // context on the client; no invalid MongoDB request should be made for them.
  if (isTranslationArticle(id)) {
    return <ArticleDetailsClient id={id} initialArticle={null} relatedArticles={[]} />;
  }

  const response = await getArticleById(id);
  const backendArticle = response.payload as BackendArticle | null;
  const initialArticle = backendArticle ? mapArticle(backendArticle) : null;
  let relatedArticles: ReturnType<typeof mapArticle>[] = [];

  if (backendArticle?.slug) {
    const relatedResponse = await getRelatedArticles(backendArticle.slug);
    const payload = Array.isArray(relatedResponse.payload) ? relatedResponse.payload as BackendArticle[] : [];
    relatedArticles = payload.map(mapArticle);
  }

  return <ArticleDetailsClient id={id} initialArticle={initialArticle} relatedArticles={relatedArticles} />;
}
