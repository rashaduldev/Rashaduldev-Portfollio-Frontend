"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

async function authHeaders() {
  const token = await getAccessToken();
  return { Authorization: `Bearer ${token}` };
}

// GET /messages — admin inbox (paginated, optional isRead/search)
export async function getMessages(params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
  search?: string;
}) {
  return apiClient({
    endpoint: "/messages",
    method: "GET",
    params: {
      ...(params?.page && { page: String(params.page) }),
      ...(params?.limit && { limit: String(params.limit) }),
      ...(params?.isRead !== undefined && { isRead: String(params.isRead) }),
      ...(params?.search && { search: params.search }),
    },
    headers: await authHeaders(),
  });
}

// GET /messages/unread-count
export async function getUnreadCount() {
  return apiClient({
    endpoint: "/messages/unread-count",
    method: "GET",
    headers: await authHeaders(),
  });
}

// PATCH /messages/:id — flag isRead / isReplied
export async function updateMessage(
  id: string,
  data: { isRead?: boolean; isReplied?: boolean },
) {
  return apiClient({
    endpoint: `/messages/${id}`,
    method: "PATCH",
    body: data,
    headers: await authHeaders(),
  });
}

// DELETE /messages/:id
export async function deleteMessage(id: string) {
  return apiClient({
    endpoint: `/messages/${id}`,
    method: "DELETE",
    headers: await authHeaders(),
  });
}
