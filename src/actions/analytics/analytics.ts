"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

export async function getAdminAnalytics(days = 30) {
  const token = await getAccessToken();
  return apiClient<AdminAnalytics>({
    endpoint: "/admin/analytics",
    method: "GET",
    params: { days },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export type AdminAnalytics = {
  periodDays: number;
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  topPages: { path: string; views: number }[];
  devices: { device: string; views: number }[];
  daily: { date: string; views: number; visitors: number }[];
};
