"use client";
import { useContext } from "react";
import { LayoutContext } from "@/components/context";
import Link from "next/link";
import Image from "next/image";
import { ArticleItem } from "@/types/translations";

export default function Articles() {
  const context = useContext(LayoutContext);
  const articles = context?.translations?.latestArticlesSection?.articles || [];

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
