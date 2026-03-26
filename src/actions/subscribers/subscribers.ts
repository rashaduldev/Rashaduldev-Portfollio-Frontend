"use server";

import { apiClient } from "@/lib/api";

// post Subscribe to newsletter
export async function subscribeNewsletter({ email }: { email: string }) {
  const res = await apiClient({
    endpoint: "/subscribers",
    method: "POST",
    body: { email },
    params: { email },
  });
  if (!res.success) {
    throw new Error(res.message || "Subscription failed");
  }

  return res;
}
