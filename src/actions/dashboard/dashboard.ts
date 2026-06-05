"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// All dashboard endpoints are admin-protected.
async function authHeaders() {
  const token = await getAccessToken();
  return { Authorization: `Bearer ${token}` };
}

// GET /dashboard/stats — counts for projects, articles, messages, subscribers, users
export async function getDashboardStats() {
  return apiClient({
    endpoint: "/dashboard/stats",
    method: "GET",
    headers: await authHeaders(),
  });
}

// GET /dashboard/activity — recent projects/articles/messages/subscribers
export async function getRecentActivity() {
  return apiClient({
    endpoint: "/dashboard/activity",
    method: "GET",
    headers: await authHeaders(),
  });
}

// GET /dashboard/views — top viewed projects & articles
export async function getViewsOverview() {
  return apiClient({
    endpoint: "/dashboard/views",
    method: "GET",
    headers: await authHeaders(),
  });
}

// GET /dashboard/growth — 30-day subscriber & message growth
export async function getGrowthData() {
  return apiClient({
    endpoint: "/dashboard/growth",
    method: "GET",
    headers: await authHeaders(),
  });
}
