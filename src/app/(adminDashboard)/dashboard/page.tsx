"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, MessageSquare, Users, Eye } from "lucide-react";
import {
  getDashboardStats,
  getRecentActivity,
} from "@/actions/dashboard/dashboard";
import GlobalLoading from "@/app/loading";

type Stats = {
  projects: { total: number; published: number; featured: number };
  articles: { total: number; published: number; drafts: number };
  messages: { total: number; unread: number };
  subscribers: { total: number; active: number };
  users: { total: number };
};

type Activity = {
  recentProjects: { _id: string; title: string; isPublished: boolean; createdAt: string }[];
  recentArticles: { _id: string; title: string; status: string; createdAt: string }[];
  recentMessages: { _id: string; name: string; email: string; isRead: boolean; createdAt: string }[];
  recentSubscribers: { _id: string; email: string; isActive: boolean; subscribedAt: string }[];
};

export default function DashboardPage() {
  const { data: statsRes, isLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });
  const { data: activityRes } = useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: getRecentActivity,
  });

  if (isLoading) return <GlobalLoading />;

  const stats = (statsRes?.payload as Stats) ?? null;
  const activity = (activityRes?.payload as Activity) ?? null;

  const cards = [
    { label: "Subscribers", value: stats?.subscribers.total ?? 0, sub: `${stats?.subscribers.active ?? 0} active`, icon: Users, color: "text-blue-600" },
    { label: "Projects", value: stats?.projects.total ?? 0, sub: `${stats?.projects.published ?? 0} published`, icon: Briefcase, color: "text-emerald-600" },
    { label: "Articles", value: stats?.articles.total ?? 0, sub: `${stats?.articles.drafts ?? 0} drafts`, icon: FileText, color: "text-primary" },
    { label: "Messages", value: stats?.messages.total ?? 0, sub: `${stats?.messages.unread ?? 0} unread`, icon: MessageSquare, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{c.label}</CardTitle>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{c.value}</div>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" /> Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity?.recentMessages?.length ? (
              activity.recentMessages.map((m) => (
                <div key={m._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-muted-foreground text-xs">{m.email}</p>
                  </div>
                  {!m.isRead && (
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">new</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" /> Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity?.recentProjects?.length ? (
              activity.recentProjects.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.title}</span>
                  <span className={`text-xs ${p.isPublished ? "text-emerald-600" : "text-amber-600"}`}>
                    {p.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
