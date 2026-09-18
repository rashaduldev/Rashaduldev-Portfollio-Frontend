"use client";

import {
  Activity,
  ExternalLink,
  Gauge,
  Laptop,
  MousePointerClick,
  RefreshCw,
  Server,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LIVE_URL = "https://rashaduldev.vercel.app";
const PAGESPEED_URL = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(LIVE_URL)}`;

type HealthMetrics = {
  latency: number | null;
  renderTime: number | null;
  checkedAt: Date | null;
  operational: boolean;
};

type PageSpeedResult = {
  strategy: "mobile" | "desktop";
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  auditedAt: string;
};

type PageSpeedResponse = {
  url: string;
  source: string;
  mobile: PageSpeedResult;
  desktop: PageSpeedResult;
};

const initialMetrics: HealthMetrics = {
  latency: null,
  renderTime: null,
  checkedAt: null,
  operational: true,
};

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3.5">
      <div className="mb-3 flex items-center justify-between text-zinc-500">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em]">{label}</span>
        {icon}
      </div>
      <p className="font-mono text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number | null }) {
  const scoreColor =
    score === null
      ? "text-zinc-500"
      : score >= 90
        ? "text-emerald-400"
        : score >= 50
          ? "text-amber-400"
          : "text-red-400";

  return (
    <a
      href={PAGESPEED_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group/score rounded-xl border border-white/10 bg-white/[0.045] p-3 transition hover:border-primary/40 hover:bg-white/[0.07]"
    >
      <div className={`font-mono text-xl font-bold ${scoreColor}`}>{score ?? "—"}</div>
      <div className="mt-1 flex items-center justify-between gap-1 text-[10px] leading-tight text-zinc-400">
        <span>{label}</span>
        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition group-hover/score:opacity-100" />
      </div>
    </a>
  );
}

export default function SystemStatus({ variant = "footer" }: { variant?: "footer" | "floating" }) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [metrics, setMetrics] = useState<HealthMetrics>(initialMetrics);
  const [pageSpeed, setPageSpeed] = useState<PageSpeedResponse | null>(null);
  const [pageSpeedLoading, setPageSpeedLoading] = useState(false);
  const [pageSpeedError, setPageSpeedError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const checkingRef = useRef(false);

  const checkHealth = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setChecking(true);

    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const renderTime = navigation
      ? Math.round(navigation.domContentLoadedEventEnd - navigation.startTime)
      : null;
    const startedAt = performance.now();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(window.location.href, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });

      setMetrics({
        latency: Math.max(1, Math.round(performance.now() - startedAt)),
        renderTime,
        checkedAt: new Date(),
        operational: response.ok && navigator.onLine,
      });
    } catch {
      setMetrics({
        latency: null,
        renderTime,
        checkedAt: new Date(),
        operational: false,
      });
    } finally {
      window.clearTimeout(timeoutId);
      checkingRef.current = false;
      setChecking(false);
    }
  }, []);

  const loadPageSpeed = useCallback(async () => {
    setPageSpeedLoading(true);
    setPageSpeedError(null);
    try {
      const response = await fetch("/api/pagespeed", { cache: "no-store" });
      const data = (await response.json()) as PageSpeedResponse & { message?: string };
      if (!response.ok) throw new Error(data.message || "Google PageSpeed Insights is unavailable");
      setPageSpeed(data);
    } catch (error) {
      setPageSpeedError(error instanceof Error ? error.message : "Google PageSpeed Insights is unavailable");
    } finally {
      setPageSpeedLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void checkHealth();
    if (!pageSpeed) void loadPageSpeed();
  }, [checkHealth, loadPageSpeed, open, pageSpeed]);

  useEffect(() => {
    const handleOnline = () => setMetrics((current) => ({ ...current, operational: true }));
    const handleOffline = () => setMetrics((current) => ({ ...current, operational: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const latencyLabel = metrics.latency === null ? "—" : `${metrics.latency} ms`;
  const renderLabel = metrics.renderTime === null ? "—" : `${metrics.renderTime} ms`;
  const performanceLabel =
    metrics.renderTime === null
      ? "Measuring"
      : metrics.renderTime < 1500
        ? "Fast"
        : metrics.renderTime < 3000
          ? "Good"
          : "Needs review";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "floating" ? (
          <button
            type="button"
            className="group fixed bottom-5 left-4 z-40 flex items-center gap-2.5 overflow-hidden rounded-full border border-zinc-700/80 bg-zinc-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl shadow-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6 sm:left-6 sm:px-4"
            aria-label="Open live health details"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_245deg,var(--primary)_315deg,transparent_360deg)] motion-reduce:animate-none" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-px rounded-full bg-zinc-950/95 backdrop-blur-xl" />
            <span className="relative z-10 flex h-2.5 w-2.5 shrink-0">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${metrics.operational ? "bg-emerald-400" : "bg-red-400"}`} />
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${metrics.operational ? "bg-emerald-500" : "bg-red-500"}`} />
            </span>
            <span className="relative z-10">Live Health</span>
            <Activity className="relative z-10 h-3.5 w-3.5 animate-pulse text-primary motion-reduce:animate-none" />
          </button>
        ) : (
          <button
            type="button"
            className="group relative mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-left text-white shadow-lg shadow-black/10 transition hover:border-zinc-700 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-4"
            aria-label="Open live system status"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${metrics.operational ? "bg-emerald-400" : "bg-red-400"}`}
                />
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${metrics.operational ? "bg-emerald-500" : "bg-red-500"}`}
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold sm:text-sm">
                  {metrics.operational ? "All Systems Operational" : "Connection Interrupted"}
                </span>
                <span className="block truncate text-[10px] text-zinc-500 sm:text-xs">rashaduldev.vercel.app</span>
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-300 sm:text-xs">
              <Gauge className="h-3.5 w-3.5 text-primary" />
              {metrics.renderTime === null ? "LIVE" : `${metrics.renderTime}ms`}
            </span>
            <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/30 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/25 transition group-hover:-translate-y-0.5 sm:text-[11px]">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Click here to see live health details
              <MousePointerClick className="h-3.5 w-3.5 transition group-hover:rotate-[-10deg] group-hover:scale-110" />
            </span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto border-zinc-800 bg-[#0b0b0d] p-0 text-white shadow-2xl sm:max-w-xl">
        <DialogHeader className="border-b border-white/10 p-5 pr-14 text-left sm:p-6 sm:pr-14">
          <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live health
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight sm:text-2xl">System status</DialogTitle>
          <DialogDescription className="mt-1.5 text-zinc-400">
            Live availability and client-side performance for my portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.07] p-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{metrics.operational ? "All Systems Operational" : "Service check unavailable"}</p>
              <p className="mt-0.5 text-xs text-zinc-500">Website and edge delivery network</p>
            </div>
            <span className="font-mono text-[10px] uppercase text-emerald-400">{metrics.operational ? "Healthy" : "Offline"}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard icon={<Server className="h-4 w-4" />} label="Response" value={latencyLabel} detail="Live round trip" />
            <MetricCard icon={<Gauge className="h-4 w-4" />} label="Rendering" value={renderLabel} detail={performanceLabel} />
          </div>

          <section className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-4" aria-labelledby="pagespeed-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 id="pagespeed-title" className="text-sm font-semibold">Google PageSpeed Insights</h3>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">Real Lighthouse audit scores for the live deployment</p>
              </div>
              <div className="grid grid-cols-2 rounded-lg bg-zinc-900 p-1">
                {(["mobile", "desktop"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStrategy(item)}
                    className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium capitalize transition ${strategy === item ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    {item === "mobile" ? <Smartphone className="h-3.5 w-3.5" /> : <Laptop className="h-3.5 w-3.5" />}
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {pageSpeedLoading ? (
              <div className="mt-4 grid grid-cols-4 gap-2" aria-label="Loading PageSpeed scores">
                {[0, 1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-white/[0.06]" />)}
              </div>
            ) : pageSpeedError ? (
              <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] p-3 text-xs text-amber-100">
                <p className="font-medium">Google’s live audit service is busy right now.</p>
                <p className="mt-1 text-amber-200/70">Scores will appear here automatically as soon as the audit quota is available.</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button type="button" onClick={() => void loadPageSpeed()} className="font-semibold text-amber-300 underline underline-offset-4">Try again</button>
                  <a href={PAGESPEED_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-4">View official report <ExternalLink className="h-3 w-3" /></a>
                </div>
              </div>
            ) : pageSpeed ? (
              <>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <ScoreCard label="Performance" score={pageSpeed[strategy].performance} />
                  <ScoreCard label="Accessibility" score={pageSpeed[strategy].accessibility} />
                  <ScoreCard label="Best Practices" score={pageSpeed[strategy].bestPractices} />
                  <ScoreCard label="SEO" score={pageSpeed[strategy].seo} />
                </div>
                <div className="mt-3 flex flex-col gap-2 text-[10px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                  <span>Audited {new Date(pageSpeed[strategy].auditedAt).toLocaleString()}</span>
                  <a href={PAGESPEED_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-400 transition hover:text-primary">View full PageSpeed report <ExternalLink className="h-3 w-3" /></a>
                </div>
              </>
            ) : null}
          </section>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => void checkHealth()}
              disabled={checking}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
              {checking ? "Checking…" : "Refresh live health"}
            </button>
          </div>

          <p className="mt-4 text-center text-[10px] text-zinc-600">
            {metrics.checkedAt ? `Last checked ${metrics.checkedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Metrics update when this panel opens"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
