"use client";
import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutContext } from "@/components/context";
import Link from "next/link";
import Image from "next/image";
import { ArticleItem } from "@/types/translations";
import { getArticles } from "@/actions/articles/articles";

export default function Articles() {
  const context = useContext(LayoutContext);
  const fallbackArticles = context?.translations?.latestArticlesSection?.articles || [];
  const { data: articlesResponse } = useQuery({ queryKey: ["public-articles"], queryFn: () => getArticles({ limit: 100 }) });
  const articles: ArticleItem[] = useMemo(() => {
    const managedArticles = articlesResponse?.payload;
    if (!Array.isArray(managedArticles) || managedArticles.length === 0) return fallbackArticles;
    return managedArticles.map((article: any) => ({
      id: article._id, title: article.title, category: article.category ?? "Article",
      date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "",
      imageUrl: article.coverImage?.url ?? "https://placehold.co/1200x720/png?text=Article",
      description: article.excerpt ?? "",
    }));
  }, [articlesResponse?.payload, fallbackArticles]);

  if (articles.length === 0)
    return <p className="text-center my-28">No articles found.</p>;

  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center">Articles</h1>

      <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {articles.map((article: ArticleItem) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            aria-label={`Read more about ${article.title}`}
            className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full h-48">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{article.category}</span>
                <span>{article.date}</span>
              </div>
              <h2 className="text-lg font-semibold">{article.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
