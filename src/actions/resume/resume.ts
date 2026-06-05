"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

export type ExperienceInput = {
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description?: string;
  order?: number;
};

export type EducationInput = {
  degree: string;
  institution: string;
  field?: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description?: string;
  order?: number;
};

async function authHeaders() {
  const token = await getAccessToken();
  return { Authorization: `Bearer ${token}` };
}

// ─── Experience ─────────────────────────────────────────────────────────────
export async function getExperience() {
  return apiClient({ endpoint: "/resume/experience", method: "GET" });
}

export async function createExperience(data: ExperienceInput) {
  return apiClient({
    endpoint: "/resume/experience",
    method: "POST",
    body: data,
    headers: await authHeaders(),
  });
}

export async function updateExperience(id: string, data: Partial<ExperienceInput>) {
  return apiClient({
    endpoint: `/resume/experience/${id}`,
    method: "PATCH",
    body: data,
    headers: await authHeaders(),
  });
}

export async function deleteExperience(id: string) {
  return apiClient({
    endpoint: `/resume/experience/${id}`,
    method: "DELETE",
    headers: await authHeaders(),
  });
}

// ─── Education ──────────────────────────────────────────────────────────────
export async function getEducation() {
  return apiClient({ endpoint: "/resume/education", method: "GET" });
}

export async function createEducation(data: EducationInput) {
  return apiClient({
    endpoint: "/resume/education",
    method: "POST",
    body: data,
    headers: await authHeaders(),
  });
}

export async function updateEducation(id: string, data: Partial<EducationInput>) {
  return apiClient({
    endpoint: `/resume/education/${id}`,
    method: "PATCH",
    body: data,
    headers: await authHeaders(),
  });
}

export async function deleteEducation(id: string) {
  return apiClient({
    endpoint: `/resume/education/${id}`,
    method: "DELETE",
    headers: await authHeaders(),
  });
}
