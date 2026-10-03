import type { MetadataRoute } from "next";
import defaultTranslations from "./translations/defaultTranslations";
import { SITE_URL } from "@/lib/seo";

const staticRoutes = [
  { path: "", priority: 1 },
  { path: "/projects", priority: 0.9 },
  { path: "/articles", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/github", priority: 0.6 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
  const projectEntries: MetadataRoute.Sitemap = defaultTranslations.projectsSection.projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const articleEntries: MetadataRoute.Sitemap = defaultTranslations.latestArticlesSection.articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries, ...articleEntries];
}
