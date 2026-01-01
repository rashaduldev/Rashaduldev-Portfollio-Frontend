"use client";

import { useContext, useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { LayoutContext } from "@/components/Layout/context";
import Image from "next/image";
import { FaGithub, FaLink, FaHeart, FaShareAlt } from "react-icons/fa";
import { Project } from "@/types/translations";
import Link from "next/link";
import { LayoutContext } from "../context";
import { Button } from "../ui/button";

type Comment = {
  name: string;
  email: string;
  message: string;
};

interface Props {
  projectId: string;
}

export default function ProjectDetailsClient({ projectId }: Props) {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("LayoutContext must be used within a LayoutContext.Provider");
  }

  const { translations, isRTL } = context;
  const projects: Project[] = translations.projectsSection?.projects || [];

  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentData, setCommentData] = useState<Comment>({
    name: "",
    email: "",
    message: "",
  });

  const project = projects.find((p) => String(p.id) === projectId);

  useEffect(() => {
    if (!projectId) return;
    const storedLikes = localStorage.getItem(`likes-${projectId}`);
    const storedComments = localStorage.getItem(`comments-${projectId}`);
    if (storedLikes) setLikes(parseInt(storedLikes));
    if (storedComments) setComments(JSON.parse(storedComments));
  }, [projectId]);

  if (!project) {
    return (
      <div className="mt-24 text-center text-gray-700 dark:text-gray-300">
        Project not found.
      </div>
    );
  }

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem(`likes-${projectId}`, newLikes.toString());
  };

  const handleCommentSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newComments = [...comments, commentData];
    setComments(newComments);
    localStorage.setItem(`comments-${projectId}`, JSON.stringify(newComments));
    setCommentData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCommentData({ ...commentData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`max-w-5xl md:mx-auto mx-3 min-h-screen transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}>
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{project.title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.techStack}</p>

      <div className="flex gap-6 flex-col sm:flex-row mb-10">
        <div className="relative w-full sm:w-2/3 h-64">
          <Image
            height={300}
            width={500}
            src={project.desktopimage}
            alt={project.title}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div className="relative w-full sm:w-1/3 h-64">
          <Image
            height={300}
            width={300}
            src={project.mobileimage}
            alt={project.title}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 items-center mb-8">
        <button onClick={handleLike} className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:scale-105 transition">
          <FaHeart /> {likes}
        </button>
        <Link href={project.githubLink || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-gray-100">
          <FaGithub size={20} />
        </Link>
        <Link href={project.liveLink || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
          <FaLink size={20} />
        </Link>
        <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
          <FaShareAlt size={20} />
        </button>
      </div>

      {/* Comment Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Leave a Comment</h3>
        <form onSubmit={handleCommentSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" required value={commentData.name} onChange={handleChange} className="p-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900" />
          <input type="email" name="email" placeholder="Email" required value={commentData.email} onChange={handleChange} className="p-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900" />
          <textarea name="message" placeholder="Your Comment" required value={commentData.message} onChange={handleChange} className="sm:col-span-2 p-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900"></textarea>
          <Button type="submit" className="col-span-2">
            Submit Comment
          </Button>
        </form>

        <div className="mt-8 space-y-4">
          {comments.map((cmt, index) => (
            <div key={index} className="border dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{cmt.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{cmt.email}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{cmt.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
