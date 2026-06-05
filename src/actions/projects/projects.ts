"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

/* ------------------------------------------
   GET ALL PROJECTS (with query support)
------------------------------------------ */
export async function getProjects(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const res = await apiClient({
    endpoint: "/projects",
    method: "GET",
    params: {
      ...(params?.search && { search: params.search }),
      ...(params?.page && { page: String(params.page) }),
      ...(params?.limit && { limit: String(params.limit) }),
    },
  });

  return res;
}

/* ------------------------------------------
   GET ALL PROJECTS (ADMIN — includes drafts)
------------------------------------------ */
export async function getAdminProjects(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: "/projects",
    method: "GET",
    params: {
      limit: String(params?.limit ?? 100),
      ...(params?.search && { search: params.search }),
      ...(params?.page && { page: String(params.page) }),
    },
    headers: { Authorization: `Bearer ${token}` },
  });

  return res;
}

/* ------------------------------------------
   GET SINGLE PROJECT
------------------------------------------ */
export async function getProjectById(id: string) {
  const res = await apiClient({
    endpoint: `/projects/${id}`,
    method: "GET",
  });

  return res;
}

/* ------------------------------------------
   CREATE PROJECT (AUTH)
------------------------------------------ */
// Accepts FormData because the backend route uses multipart upload for images.
// Build the FormData in the page (text fields + repeated `images` files).
export async function createProject(formData: FormData) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/projects",
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}

/* ------------------------------------------
   UPDATE PROJECT (AUTH)
------------------------------------------ */
export async function updateProject(id: string, formData: FormData) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/projects/${id}`,
    method: "PATCH",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}

/* ------------------------------------------
   DELETE PROJECT (AUTH)
------------------------------------------ */
export async function deleteProject(id: string) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/projects/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}

/* ------------------------------------------
   DELETE SINGLE IMAGE (AUTH)
------------------------------------------ */
export async function deleteProjectImage(id: string, publicId: string) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/projects/${id}/images/${publicId}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}
