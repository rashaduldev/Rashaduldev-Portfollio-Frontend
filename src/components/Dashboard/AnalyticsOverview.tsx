"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Eye, MonitorSmartphone, RefreshCw, UsersRound } from "lucide-react";
import { getAdminAnalytics } from "@/actions/analytics/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsOverview() {
  const query = useQuery({ queryKey: ["admin", "analytics", 30], queryFn: () => getAdminAnalytics(30), staleTime: 60_000 });
  const analytics = query.data?.payload;

  if (query.isLoading) return <Card><CardContent className="py-8 text-sm text-muted-foreground">Loading first-party analytics…</CardContent></Card>;
  if (query.isError || !query.data?.success || !analytics) return <Card><CardHeader><CardTitle className="text-base">Analytics unavailable</CardTitle></CardHeader><CardContent className="flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground">The admin session expired or the analytics API could not be reached.</p><Button size="sm" variant="outline" onClick={() => query.refetch()}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button></CardContent></Card>;

  const metrics = [
    { label: "Page views", value: analytics.pageViews, icon: Eye },
    { label: "Unique visitors", value: analytics.uniqueVisitors, icon: UsersRound },
    { label: "Sessions", value: analytics.sessions, icon: BarChart3 },
    { label: "Tracked devices", value: analytics.devices.length, icon: MonitorSmartphone },
  ];

  return <section className="space-y-4" aria-labelledby="analytics-heading">
    <div><h2 id="analytics-heading" className="text-xl font-bold">Website analytics</h2><p className="text-sm text-muted-foreground">Consent-based, deduplicated activity from the last {analytics.periodDays} days.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value.toLocaleString()}</p></div><Icon className="h-5 w-5 text-primary" /></CardContent></Card>)}</div>
    <div className="grid gap-4 xl:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-base">Top pages</CardTitle></CardHeader><CardContent className="space-y-3">{analytics.topPages.length ? analytics.topPages.map((page) => <div key={page.path} className="flex items-center justify-between gap-4 text-sm"><span className="truncate font-medium">{page.path}</span><span className="tabular-nums text-muted-foreground">{page.views}</span></div>) : <p className="text-sm text-muted-foreground">No consented page views recorded yet.</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Devices</CardTitle></CardHeader><CardContent className="space-y-3">{analytics.devices.length ? analytics.devices.map((item) => <div key={item.device} className="flex items-center justify-between text-sm"><span className="capitalize">{item.device}</span><span className="tabular-nums text-muted-foreground">{item.views}</span></div>) : <p className="text-sm text-muted-foreground">No device data recorded yet.</p>}</CardContent></Card>
    </div>
  </section>;
}
