"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

/* ------------------------------------------
   GET TAXONOMY (tags + categories)
------------------------------------------ */
export async function getArticleTaxonomy() {
  const res = await apiClient({
    endpoint: "/articles/taxonomy",
    method: "GET",
  });

  return res;
}

/* ------------------------------------------
   GET ALL ARTICLES (filters + pagination)
------------------------------------------ */
export async function getArticles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
  category?: string;
  status?: "draft" | "published" | "archived";
  isFeatured?: boolean;
}) {
  const res = await apiClient({
    endpoint: "/articles",
    method: "GET",
    params: {
      ...(params?.page && { page: String(params.page) }),
      ...(params?.limit && { limit: String(params.limit) }),
      ...(params?.search && { search: params.search }),
      ...(params?.tags && { tags: params.tags }),
      ...(params?.category && { category: params.category }),
      ...(params?.status && { status: params.status }),
      ...(params?.isFeatured !== undefined && {
        isFeatured: String(params.isFeatured),
      }),
    },
  });

  return res;
}

/* ------------------------------------------
   GET ARTICLE BY ID
------------------------------------------ */
export async function getArticleById(id: string) {
  const res = await apiClient({
    endpoint: `/articles/id/${id}`,
    method: "GET",
  });

  return res;
}

/* ------------------------------------------
   GET ARTICLE BY SLUG
------------------------------------------ */
export async function getArticleBySlug(slug: string) {
  const res = await apiClient({
    endpoint: `/articles/${slug}`,
    method: "GET",
  });

  return res;
}

/* ------------------------------------------
   GET RELATED ARTICLES
------------------------------------------ */
export async function getRelatedArticles(slug: string) {
  const res = await apiClient({
    endpoint: `/articles/${slug}/related`,
    method: "GET",
  });

  return res;
}

/* ------------------------------------------
   CREATE ARTICLE (multipart/form-data)
------------------------------------------ */
export async function createArticle(data: {
  title: string;
  content: string;
  excerpt?: string;
  contentType?: string;
  tags?: string[];
  category?: string;
  status?: string;
  coverImage?: File; // important
}) {
  const token = await getAccessToken();

  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);

  if (data.excerpt) formData.append("excerpt", data.excerpt);
  if (data.contentType) formData.append("contentType", data.contentType);
  if (data.category) formData.append("category", data.category);
  if (data.status) formData.append("status", data.status);

  // tags array
  if (data.tags?.length) {
    data.tags.forEach((tag) => formData.append("tags", tag));
  }

  // file upload
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  const res = await apiClient({
    endpoint: "/articles",
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}

/* ------------------------------------------
   UPDATE ARTICLE (by slug)
------------------------------------------ */
export async function updateArticle(
  slug: string,
  data: Partial<{
    title: string;
    content: string;
    excerpt: string;
    contentType: string;
    tags: string[];
    category: string;
    status: string;
    coverImage: File;
  }>
) {
  const token = await getAccessToken();

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;

    if (key === "tags" && Array.isArray(value)) {
      value.forEach((tag) => formData.append("tags", tag));
    } else if (key === "coverImage" && value instanceof File) {
      formData.append("coverImage", value);
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await apiClient({
    endpoint: `/articles/${slug}`,
    method: "PATCH",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}

/* ------------------------------------------
   DELETE ARTICLE (by slug)
------------------------------------------ */
export async function deleteArticle(slug: string) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/articles/${slug}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}