"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

export type Skill = {
  name: string;
  category?: string;
  level?: number;
};

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  devto?: string;
  hashnode?: string;
};

async function authHeaders() {
  const token = await getAccessToken();
  return { Authorization: `Bearer ${token}` };
}

// GET /users/me — profile + populated user (name/email/role)
export async function getMyProfile() {
  return apiClient({
    endpoint: "/users/me",
    method: "GET",
    headers: await authHeaders(),
  });
}

// PATCH /users/me — update account name/email
export async function updateMe(data: { name?: string; email?: string }) {
  return apiClient({
    endpoint: "/users/me",
    method: "PATCH",
    body: data,
    headers: await authHeaders(),
  });
}

// PATCH /users/me/profile — update bio, headline, location, website, skills, social, isPublic
export async function updateMyProfile(data: {
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  skills?: Skill[];
  socialLinks?: SocialLinks;
  isPublic?: boolean;
}) {
  return apiClient({
    endpoint: "/users/me/profile",
    method: "PATCH",
    body: data,
    headers: await authHeaders(),
  });
}

// POST /users/me/avatar — multipart, field name "avatar"
export async function uploadAvatar(formData: FormData) {
  return apiClient({
    endpoint: "/users/me/avatar",
    method: "POST",
    body: formData,
    headers: await authHeaders(),
  });
}

// POST /users/me/resume — multipart, field name "resume" (PDF)
export async function uploadResumeFile(formData: FormData) {
  return apiClient({
    endpoint: "/users/me/resume",
    method: "POST",
    body: formData,
    headers: await authHeaders(),
  });
}
