import type { Metadata } from "next";

export const SITE_URL = "https://rashaduldev.vercel.app";
export const SITE_NAME = "Md Rashadul Islam — Frontend Developer";
export const DEFAULT_DESCRIPTION = "Portfolio of Md Rashadul Islam, a frontend and full-stack developer specializing in React, Next.js, TypeScript, accessible UI, and performance optimization.";
export const DEFAULT_KEYWORDS = ["Md Rashadul Islam", "frontend developer", "Next.js developer", "React developer", "TypeScript", "web developer portfolio", "Bangladesh developer"];

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
