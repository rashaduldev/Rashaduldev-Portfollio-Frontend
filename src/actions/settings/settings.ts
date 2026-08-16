"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

export type SiteSettings = {
  siteName?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  enableSitemap?: boolean;
  googleAnalyticsId?: string;
  cookiePolicy?: { title?: string; bannerImage?: string; content?: string };
};

// GET /settings — public, returns the singleton settings document
export async function getSettings() {
  return apiClient({ endpoint: "/settings", method: "GET" });
}

// PATCH /settings — admin only
export async function updateSettings(data: SiteSettings) {
  const token = await getAccessToken();
  return apiClient({
    endpoint: "/settings",
    method: "PATCH",
    body: data,
    headers: { Authorization: `Bearer ${token}` },
  });
}
