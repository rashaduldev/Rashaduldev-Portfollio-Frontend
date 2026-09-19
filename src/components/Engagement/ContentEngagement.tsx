"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Send, UserRound } from "lucide-react";
import toast from "react-hot-toast";

export interface PublicComment { _id?: string; name: string; content: string; createdAt: string }
interface Engagement { likes: number; comments: PublicComment[] }
interface Props { resource: "articles" | "projects"; resourceId: string; initialLikes?: number; initialComments?: PublicComment[] }

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "")}/api${path}`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), options);
  const result = await response.json();
  if (!response.ok || result.success === false) throw new Error(result.message ?? "Request failed");
  return result.data as T;
}

export default function ContentEngagement({ resource, resourceId, initialLikes = 0, initialComments = [] }: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["content-engagement", resource, resourceId];
  const basePath = resource === "articles" ? `/articles/id/${resourceId}` : `/projects/${resourceId}`;
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const { data = { likes: initialLikes, comments: initialComments } } = useQuery({
    queryKey,
    queryFn: () => request<Engagement>(`${basePath}/engagement`),
    initialData: { likes: initialLikes, comments: initialComments },
    retry: 1,
  });

  const commentMutation = useMutation({
    mutationFn: () => request<PublicComment[]>(`${basePath}/comments`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), content: content.trim() }),
    }),
    onSuccess: (comments) => {
      queryClient.setQueryData<Engagement>(queryKey, (current) => ({ likes: current?.likes ?? data.likes, comments }));
      setName(""); setContent(""); toast.success("Comment published successfully.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not publish comment."),
  });

  const likeMutation = useMutation({
    mutationFn: () => request<{ likes: number }>(`${basePath}/like`, { method: "POST" }),
    onSuccess: ({ likes }) => {
      queryClient.setQueryData<Engagement>(queryKey, (current) => ({ likes, comments: current?.comments ?? data.comments }));
      localStorage.setItem(`liked:${resource}:${resourceId}`, "true");
    },
    onError: () => toast.error("Could not register your like."),
  });

  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 2) return toast.error("Please enter at least 2 characters for your name.");
    if (!content.trim()) return toast.error("Please write a comment.");
    commentMutation.mutate();
  };

  const like = () => {
    if (localStorage.getItem(`liked:${resource}:${resourceId}`)) return toast("You already liked this.");
    likeMutation.mutate();
  };

  return <section className="mt-10 rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur-sm sm:p-7">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
      <div><p className="text-sm font-medium text-primary">Join the conversation</p><h2 className="mt-1 flex items-center gap-2 text-2xl font-bold"><MessageCircle className="h-5 w-5" /> Comments ({data.comments.length})</h2></div>
      <button type="button" onClick={like} disabled={likeMutation.isPending} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-rose-500/25 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400"><Heart className="h-4 w-4" fill={data.likes > 0 ? "currentColor" : "none"} /> {data.likes} {data.likes === 1 ? "Like" : "Likes"}</button>
    </div>
    <form onSubmit={submitComment} className="mt-6 space-y-4">
      <label className="block"><span className="mb-2 block text-sm font-semibold">Your name</span><div className="relative"><UserRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} autoComplete="name" placeholder="Enter your name" className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></div></label>
      <label className="block"><span className="mb-2 block text-sm font-semibold">Your comment</span><textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={1000} rows={5} placeholder="Share your thoughts about this work…" className="w-full resize-y rounded-xl border border-input bg-background p-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /><span className="mt-1 block text-right text-xs text-muted-foreground">{content.length}/1000</span></label>
      <button type="submit" disabled={commentMutation.isPending} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"><Send className="h-4 w-4" />{commentMutation.isPending ? "Publishing…" : "Publish comment"}</button>
    </form>
    <div className="mt-8 space-y-4">
      {data.comments.length === 0 && <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts.</div>}
      {[...data.comments].reverse().map((comment, index) => <article key={comment._id ?? `${comment.name}-${comment.createdAt}-${index}`} className="rounded-xl border border-border bg-background/70 p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{comment.name.charAt(0).toUpperCase()}</span><div><h3 className="text-sm font-semibold">{comment.name}</h3><time className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</time></div></div><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">{comment.content}</p></article>)}
    </div>
  </section>;
}
