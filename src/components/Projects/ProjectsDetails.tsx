"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaHeart, FaLink, FaShareAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import BlobsButton from "../Common/Blobsbutton";

const api = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}/api${path}`;
type Comment = { _id?: string; name: string; content: string; createdAt: string };
type Project = { _id: string; title: string; description: string; techStack?: string[]; images?: { url: string }[]; githubUrl?: string; liveUrl?: string; likes?: number; comments?: Comment[] };

export default function ProjectDetailsClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState({ name: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(api(`/projects/${projectId}`)).then((res) => res.json()).then((data) => {
      setProject(data.data ?? null);
      setComments(data.data?.comments ?? []);
    }).catch(() => toast.error("Unable to load this project."));
  }, [projectId]);

  const handleLike = async () => {
    const res = await fetch(api(`/projects/${projectId}/like`), { method: "POST" });
    const data = await res.json();
    if (data.data?.likes !== undefined) setProject((current) => current ? { ...current, likes: data.data.likes } : current);
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch(api(`/projects/${projectId}/comments`), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setComments(data.data); setForm({ name: "", content: "" }); toast.success("Comment submitted.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not submit comment."); }
    finally { setSubmitting(false); }
  };

  const share = async () => {
    if (navigator.share) await navigator.share({ title: project?.title, url: window.location.href });
    else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied to clipboard."); }
  };

  if (!project) return <div className="mt-24 text-center">Loading project...</div>;
  const images = project.images ?? [];
  return <div className="max-w-5xl md:mx-auto mx-3 min-h-screen">
    <h1 className="text-3xl font-bold mb-4">{project.title}</h1><p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
    {!!project.techStack?.length && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.techStack.join(", ")}</p>}
    {!!images.length && <div className="grid gap-6 sm:grid-cols-2 mb-10">{images.map((image, index) => <div key={image.url} className="relative h-64"><Image fill src={image.url} alt={`${project.title} screenshot ${index + 1}`} sizes="(max-width: 640px) 100vw, 50vw" className="rounded-lg object-cover" /></div>)}</div>}
    <div className="flex gap-6 items-center mb-8"><button onClick={handleLike} className="flex items-center gap-2 text-red-600"><FaHeart /> {project.likes ?? 0}</button>{project.githubUrl && <Link href={project.githubUrl} target="_blank"><FaGithub size={20} /></Link>}{project.liveUrl && <Link href={project.liveUrl} target="_blank"><FaLink size={20} /></Link>}<button onClick={share}><FaShareAlt size={20} /></button></div>
    <section className="mt-10"><h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2><form onSubmit={submitComment} className="grid gap-4"><input required value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-2 rounded-md border bg-white dark:bg-gray-800" /><textarea required value={form.content} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, content: e.target.value })} placeholder="Your comment" className="p-2 rounded-md border bg-white dark:bg-gray-800" /><BlobsButton disabled={submitting} type="submit" className="px-5 py-1">{submitting ? "Submitting..." : "Submit comment"}</BlobsButton></form><div className="mt-8 space-y-4">{comments.map((comment) => <div key={comment._id ?? `${comment.name}-${comment.createdAt}`} className="border rounded-md p-4"><p className="font-semibold">{comment.name}</p><p className="mt-2">{comment.content}</p><time className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</time></div>)}</div></section>
  </div>;
}
