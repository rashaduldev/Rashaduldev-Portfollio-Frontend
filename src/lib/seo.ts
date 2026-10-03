import type { Metadata } from "next";

export const SITE_URL = "https://rashaduldev.vercel.app";
export const SITE_NAME = "Md Rashadul Islam | Full Stack & MERN Developer";
export const DEFAULT_DESCRIPTION = "Portfolio of Md Rashadul Islam, a Full Stack Developer specializing in MERN stack, Next.js, TypeScript, and modern web application architecture.";
export const DEFAULT_KEYWORDS = ["Md Rashadul Islam", "Md Rashadul Islam Portfolio", "Full Stack Developer Bangladesh", "MERN Stack Developer", "Next.js Developer"];
export const SOCIAL_PROFILES = [
  "https://github.com/rashaduldev",
  "https://www.linkedin.com/in/rashaduldev",
  "https://app.daily.dev/rashaduldev",
  "https://www.codewars.com/users/rashaduldev",
];

interface PageMetadataInput { title: string; description: string; path: string; keywords?: string[] }

export function createPageMetadata({ title, description, path, keywords = [] }: PageMetadataInput): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: SITE_NAME, type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}
