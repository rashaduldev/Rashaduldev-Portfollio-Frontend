import Projects from "@/components/Projects/Projects";
import type { Metadata } from "next";
import JsonLd from "@/components/Seo/JsonLd";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "Projects", description: "Explore production web applications built by Md Rashadul Islam with Next.js, React, TypeScript, and modern full-stack technologies.", path: "/projects", keywords: ["web development projects", "Next.js portfolio projects"] });

const ProjectsPage = () => {
  return (
    <div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Projects by Md Rashadul Islam", url: `${SITE_URL}/projects`, description: "Production web applications built with Next.js, React, TypeScript, and modern full-stack technologies." }} />
      <Projects />
    </div>
  );
};

export default ProjectsPage;
