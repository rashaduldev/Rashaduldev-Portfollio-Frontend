"use client";

import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowUpRight, List, Share2, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { LayoutContext } from "@/components/context";
import { getArticleEditorial } from "@/lib/articleEditorial";
import ArticleEditorialBody from "./ArticleEditorialBody";
import ArticleEditorialHero from "./ArticleEditorialHero";
import ArticleReadingProgress from "./ArticleReadingProgress";
import ContentEngagement, { type PublicComment } from "../Engagement/ContentEngagement";

type ArticleItem = {
  id: number | string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  date: string;
  content?: string;
  likes?: number;
  comments?: PublicComment[];
  user?: { name?: string; bio?: string };
};

type Props = { id?: string; initialArticle?: ArticleItem | null; relatedArticles?: ArticleItem[] };

export default function ArticleDetailsClient({ id: propId, initialArticle, relatedArticles = [] }: Props) {
  const params = useParams();
  const context = useContext(LayoutContext);
  const routeId = propId ?? (Array.isArray(params.id) ? params.id[0] : params.id);
  const translatedArticles = context?.translations.latestArticlesSection?.articles ?? [];
  const fallbackArticle = translatedArticles.find((item) => String(item.id) === String(routeId));
  const article: ArticleItem | null = initialArticle ?? (fallbackArticle as ArticleItem | undefined) ?? null;
  const related = relatedArticles.length > 0 ? relatedArticles : translatedArticles.filter((item) => String(item.id) !== String(routeId)).slice(0, 2);

  if (!routeId || !article) {
    return <div className="grid min-h-[60vh] place-items-center px-4 text-center text-muted-foreground">Article not found.</div>;
  }

  const editorial = getArticleEditorial(String(routeId), article.title, article.description ?? article.content ?? "A practical engineering insight.");
  const readTime = estimateReadTime(article.content, editorial);
  const author = article.user?.name || "Md Rashadul Islam";

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: article.title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Article link copied");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") toast.error("Unable to share this article");
    }
  };

  return <>
    <ArticleReadingProgress />
    <ArticleEditorialHero title={article.title} subtitle={editorial.subtitle} category={article.category} date={article.date} author={author} readTime={readTime} image={article.imageUrl} />
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:py-20">
      <main className="min-w-0">
        <ArticleEditorialBody editorial={editorial} originalContent={article.content} />
        <div className="mt-16"><ContentEngagement resource="articles" resourceId={String(routeId)} initialLikes={article.likes} initialComments={article.comments} /></div>
        {related.length > 0 && <section className="mt-16 border-t border-border pt-10">
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Keep exploring</p><h2 className="mt-2 text-2xl font-black">Related insights</h2></div><Link href="/articles" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">All articles <ArrowUpRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-5 sm:grid-cols-2">{related.map((item) => <Link key={item.id} href={`/articles/${item.id}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
            <div className="relative h-44 overflow-hidden"><Image src={item.imageUrl} alt={`${item.title} article cover`} fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover transition duration-500 group-hover:scale-105" /></div>
            <div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">{item.category}</p><h3 className="mt-2 text-lg font-black leading-7">{item.title}</h3><p className="mt-3 text-sm text-muted-foreground">{item.date}</p></div>
          </Link>)}</div>
        </section>}
      </main>

      <aside className="hidden lg:block"><div className="sticky top-24 space-y-5">
        <nav aria-label="Article sections" className="rounded-2xl border border-border bg-card p-5"><div className="mb-4 flex items-center gap-2 text-sm font-black"><List className="h-4 w-4 text-primary" /> In this article</div><ol className="space-y-3">{editorial.sections.map((section, index) => <li key={section.title}><a href={`#section-${index + 1}`} className="flex gap-3 text-sm leading-5 text-muted-foreground transition hover:text-primary"><span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol></nav>
        <div className="rounded-2xl bg-zinc-950 p-5 text-white"><UserRound className="h-8 w-8 text-primary" /><p className="mt-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Written by</p><p className="mt-1 font-black">{author}</p><p className="mt-2 text-sm leading-6 text-zinc-400">{article.user?.bio || "Full-stack developer sharing practical lessons from building modern web products."}</p></div>
        <button type="button" onClick={handleShare} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"><Share2 className="h-4 w-4" /> Share article</button>
      </div></aside>
    </div>
  </>;
}

function estimateReadTime(content: string | undefined, editorial: ReturnType<typeof getArticleEditorial>) {
  const text = [content, editorial.subtitle, ...editorial.takeaways, ...editorial.sections.flatMap((section) => [section.introduction, section.details, ...(section.checklist ?? [])]), ...editorial.practicalSteps, editorial.conclusion].filter(Boolean).join(" ");
  return `${Math.max(4, Math.ceil(text.trim().split(/\s+/).length / 200))} min read`;
}
