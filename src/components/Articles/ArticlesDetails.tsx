"use client";

import { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { LayoutContext } from "@/components/context";
import BlobsButton from "../Common/Blobsbutton";
import { Input } from "../ui/input";
import toast from "react-hot-toast";

type ArticleItem = {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  date: string;
  content?: string;
};

export default function ArticleDetailsClient() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  if (!context.translations?.latestArticlesSection) {
    throw new Error("Translations or articles section not available");
  }

  const articles = useMemo(
    () => context.translations.latestArticlesSection.articles || [],
    [context.translations.latestArticlesSection.articles]
  );

  const [article, setArticle] = useState<ArticleItem | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!id) return;

    const found = articles.find((a) => String(a.id) === String(id));
    setArticle(found || null);

    try {
      const storedLikes = localStorage.getItem(`likes-${id}`);
      if (storedLikes) setLikes(Number(storedLikes));

      const storedComments = JSON.parse(
        localStorage.getItem(`comments-${id}`) || "[]"
      );
      setComments(storedComments);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setLikes(0);
      setComments([]);
    }
  }, [id, articles]);

  const handleLike = () => {
    if (!id) return;
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    try {
      localStorage.setItem(`likes-${id}`, updatedLikes.toString());
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

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

  const handleComment = () => {
    if (!id || newComment.trim() === "" || newComment.length > 500) {
      toast.error("Comment must be between 1 and 500 characters.");
      return;
    }
    const updatedComments = [...comments, newComment.trim()];
    setComments(updatedComments);
    try {
      localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    setNewComment("");
  };

  if (!id) {
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
    <div className="max-w-4xl md:mx-auto mx-3 py-4 md:p-0 space-y-6">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <div className="text-sm text-gray-500">
        <span>{article.category}</span> • <span>{article.date}</span>
      </div>

      <Image
        src={article.imageUrl}
        alt={article.title}
        width={800}
        height={500}
        className="w-full h-96 object-cover rounded"
      />

      <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
        {article.content || "This is the article content placeholder."}
      </p>

      <div className="flex items-center gap-4 mt-4">
        <BlobsButton
          onClick={handleLike}
          aria-label={`Like article, ${likes} likes`}
          className="px-5 py-1"
        >
          ❤️ Like ({likes})
        </BlobsButton>

        <BlobsButton
          onClick={handleShare}
          aria-label="Share article"
          className="px-5 py-1"
        >
          🔗 Share
        </BlobsButton>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">
          Comments ({comments.length})
        </h3>
        <div className="space-y-3">
          {comments.map((cmt, idx) => (
            <div
              key={idx}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow-sm"
            >
              {cmt}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            aria-label="Comment input"
          />
          <BlobsButton onClick={handleComment} className="px-5 py-1">
            Comment
          </BlobsButton>
        </div>
      </div>
    </div>
  );
}
