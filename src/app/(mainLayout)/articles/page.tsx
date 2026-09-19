import Articles from "@/components/Articles/Articles";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "Articles", description: "Read articles by Md Rashadul Islam about frontend engineering, Next.js, React, TypeScript, and modern web development.", path: "/articles", keywords: ["frontend articles", "Next.js articles"] });

const ArticlesPage = () => {
  return (
    <>
      <Articles />
    </>
  );
};

export default ArticlesPage;
