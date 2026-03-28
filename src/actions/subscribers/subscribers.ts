"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// post Subscribe to newsletter
export async function subscribeNewsletter({ email }: { email: string }) {
  const res = await apiClient({
    endpoint: "/subscribers",
    method: "POST",
    body: { email },
    params: { email },
  });
  return res;
}

// get all subscribers - admin
export async function getAllSubscribers({ isActive }: { isActive?: boolean }) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/subscribers",
    method: "GET",
    params: isActive !== undefined ? { isActive: String(isActive) } : {},
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
}

// delete subscriber - admin
export async function deleteSubscriber({ id }: { id: string }) {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/subscribers/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}
