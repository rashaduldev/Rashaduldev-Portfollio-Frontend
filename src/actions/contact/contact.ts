"use server";

import { apiClient } from "@/lib/api";

// send a contact message
export async function sendContactMessage({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const res = await apiClient({
    endpoint: "/messages",
    method: "POST",
    body: { name, email, phone, message },
  });
  return res;
}
