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
export async function createProject(data: {
  title: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  images?: string[]; // or File[] depending on your setup
}) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/projects",
    method: "POST",
    body: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}

/* ------------------------------------------
   UPDATE PROJECT (AUTH)
------------------------------------------ */
export async function updateProject(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    liveUrl: string;
    githubUrl: string;
  }>,
) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/projects/${id}`,
    method: "PATCH",
    body: data,
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
