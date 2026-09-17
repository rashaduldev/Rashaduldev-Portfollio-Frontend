"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, MessageSquare, Users, Eye, TrendingUp } from "lucide-react";
import {
  getDashboardStats,
  getRecentActivity,
  getGrowthData,
  getViewsOverview,
} from "@/actions/dashboard/dashboard";
import GlobalLoading from "@/app/loading";
import { Button } from "@/components/ui/button";

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

type Views = {
  topProjects: { _id?: string; title: string; views: number }[];
  topArticles: { _id?: string; title: string; slug: string; views: number }[];
};

type Growth = {
  subscriberGrowth: { _id: string; count: number }[];
  messageGrowth: { _id: string; count: number }[];
};

export default function DashboardPage() {
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });
  const activityQuery = useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: getRecentActivity,
  });
  const viewsQuery = useQuery({
    queryKey: ["dashboard", "views"],
    queryFn: getViewsOverview,
  });
  const growthQuery = useQuery({
    queryKey: ["dashboard", "growth"],
    queryFn: getGrowthData,
  });

  const queries = [statsQuery, activityQuery, viewsQuery, growthQuery];
  if (queries.some((query) => query.isLoading)) return <GlobalLoading />;

  const failed = queries.find((query) => query.isError || query.data?.success === false);
  if (failed) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader><CardTitle>Dashboard data is unavailable</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Your session may have expired, or the API could not be reached.</p>
          <Button onClick={() => queries.forEach((query) => query.refetch())}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const stats = (statsQuery.data?.payload as Stats) ?? null;
  const activity = (activityQuery.data?.payload as Activity) ?? null;
  const views = (viewsQuery.data?.payload as Views) ?? null;
  const growth = (growthQuery.data?.payload as Growth) ?? null;
  const newSubscribers = growth?.subscriberGrowth.reduce((sum, point) => sum + point.count, 0) ?? 0;
  const newMessages = growth?.messageGrowth.reduce((sum, point) => sum + point.count, 0) ?? 0;

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

      <div className="grid gap-6 xl:grid-cols-2">
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

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4" /> Last 30 days</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div><p className="text-2xl font-bold">{newSubscribers}</p><p className="text-xs text-muted-foreground">New subscribers</p></div>
            <div><p className="text-2xl font-bold">{newMessages}</p><p className="text-xs text-muted-foreground">New messages</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Most viewed projects</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {views?.topProjects.length ? views.topProjects.map((item) => <div key={item._id ?? item.title} className="flex justify-between gap-4 text-sm"><span className="truncate">{item.title}</span><span className="font-medium">{item.views}</span></div>) : <p className="text-sm text-muted-foreground">No view data yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Most viewed articles</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {views?.topArticles.length ? views.topArticles.map((item) => <div key={item._id ?? item.slug} className="flex justify-between gap-4 text-sm"><span className="truncate">{item.title}</span><span className="font-medium">{item.views}</span></div>) : <p className="text-sm text-muted-foreground">No view data yet.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent articles</CardTitle></CardHeader>
          <CardContent className="space-y-3">{activity?.recentArticles?.length ? activity.recentArticles.map((item) => <div key={item._id} className="flex justify-between gap-4 text-sm"><span className="truncate">{item.title}</span><span className="capitalize text-muted-foreground">{item.status}</span></div>) : <p className="text-sm text-muted-foreground">No articles yet.</p>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent subscribers</CardTitle></CardHeader>
          <CardContent className="space-y-3">{activity?.recentSubscribers?.length ? activity.recentSubscribers.map((item) => <div key={item._id} className="flex justify-between gap-4 text-sm"><span className="truncate">{item.email}</span><span className={item.isActive ? "text-emerald-600" : "text-muted-foreground"}>{item.isActive ? "Active" : "Inactive"}</span></div>) : <p className="text-sm text-muted-foreground">No subscribers yet.</p>}</CardContent>
        </Card>
      </div>
    </div>
  );
}
