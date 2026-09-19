"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LayoutContext } from "@/components/context";
import BlobsButton from "../Common/Blobsbutton";
import ContentEngagement, { type PublicComment } from "../Engagement/ContentEngagement";
import { FiClock, FiUser, FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";

type ArticleItem = {
  id: number | string;
  title: string;
  imageUrl: string;
  category: string;
  date: string;
  content?: string;
  likes?: number;
  comments?: PublicComment[];
  user?: { name?: string; bio?: string };
};

type Props = {
  id?: string;
  initialArticle?: ArticleItem | null;
  relatedArticles?: ArticleItem[];
};

export default function ArticleDetailsClient({ id: propId, initialArticle, relatedArticles }: Props) {
  const params = useParams();
  const routeId = propId ?? (Array.isArray(params.id) ? params.id[0] : params.id);
  const related = relatedArticles || [];
  const context = useContext(LayoutContext);
  const fallbackArticle = context?.translations.latestArticlesSection?.articles.find((item) => String(item.id) === String(routeId));

  const [article, setArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    if (!routeId) return;

    if (initialArticle) {
      setArticle(initialArticle);
    } else {
      setArticle(fallbackArticle ?? null);
    }
  }, [routeId, initialArticle, fallbackArticle]);

  const handleShare = async () => {
    const shareData = {
      title: article?.title || "Article",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  if (!routeId) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-300">
        Invalid article ID
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-300">
        Loading article or article not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl md:mx-auto mx-3 py-6 md:p-0">
      <div className="grid gap-8 md:grid-cols-3">
        <main className="md:col-span-2 space-y-6">
          <header>
            <h1 className="text-4xl font-extrabold leading-tight">{article.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><FiUser /> {article.user?.name || 'Author'}</span>
              <span className="flex items-center gap-1"><FiClock /> {estimateReadTime(article.content)} • {article.date}</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">{article.category}</span>
            </div>
          </header>

          <div className="w-full overflow-hidden rounded shadow">
            <Image src={article.imageUrl} alt={article.title} width={1200} height={600} className="w-full h-80 object-cover" />
          </div>

          <article className="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-200">
            <p>{article.content || "This is the article content placeholder."}</p>
          </article>

          <ContentEngagement resource="articles" resourceId={String(routeId)} initialLikes={article.likes} initialComments={article.comments} />

          {related && related.length > 0 && (
            <section className="mt-10">
              <h3 className="text-2xl font-semibold mb-4">Related articles</h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/articles/${r.id}`} className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
                    <div className="relative w-full h-36"><Image src={r.imageUrl} alt={r.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /></div>
                    <div className="p-3"><h4 className="text-sm font-medium">{r.title}</h4><div className="text-xs text-gray-500">{r.date}</div></div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="md:col-span-1 space-y-6">
          <div className="sticky top-20 space-y-4">
            <div className="p-4 border rounded-lg bg-white/70 dark:bg-gray-900/60">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">Engage</div>
                <div className="text-sm text-gray-500">Comments and likes are synced live</div>
              </div>
              <div className="mt-3 flex gap-3">
                <BlobsButton onClick={handleShare} aria-label="Share article" className="px-4 py-2"><FiShare2 /></BlobsButton>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white/70 dark:bg-gray-900/60">
              <div className="text-sm text-gray-500">About the author</div>
              <div className="mt-3">
                <div className="font-medium">{article.user?.name || 'Author'}</div>
                <div className="text-xs text-gray-500">{article.user?.bio || 'Full-stack developer and writer.'}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function estimateReadTime(text?: string) {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
