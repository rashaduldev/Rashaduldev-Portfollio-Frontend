"use server";

import { getAccessToken } from "@/actions/auth";
import { apiClient } from "@/lib/api";

export type AdminComment = {
  _id: string;
  resourceType: "article" | "project";
  resourceId: string;
  resourceTitle: string;
  name: string;
  content: string;
  createdAt: string;
};

async function authHeaders() {
  const token = await getAccessToken();
  return { Authorization: `Bearer ${token}` };
}

export async function getAdminComments() {
  return apiClient<AdminComment[]>({
    endpoint: "/engagement/comments",
    headers: await authHeaders(),
  });
}

export async function deleteAdminComment(comment: AdminComment) {
  return apiClient({
    endpoint: `/engagement/${comment.resourceType}/${comment.resourceId}/comments/${comment._id}`,
    method: "DELETE",
    headers: await authHeaders(),
  });
}
