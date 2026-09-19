"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  ExternalLink,
  LoaderCircle,
  Maximize2,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Viewport = "desktop" | "tablet" | "mobile";
type LoadStatus = "loading" | "ready";

const VIEWPORTS: Record<
  Viewport,
  { label: string; width: string; icon: typeof Monitor }
> = {
  desktop: { label: "Desktop", width: "100%", icon: Monitor },
  tablet: { label: "Tablet", width: "768px", icon: Tablet },
  mobile: { label: "Mobile", width: "375px", icon: Smartphone },
};

interface ProjectPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
}

export default function ProjectPreviewModal({
  open,
  onOpenChange,
  title,
  url,
}: ProjectPreviewModalProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");

  useLayoutEffect(() => {
    if (!open) return;
    setViewport("desktop");
    setLoadStatus("loading");
  }, [open, url]);

  useEffect(() => {
    if (!open || loadStatus !== "loading") return;

    // Cross-origin sites can delay or suppress the iframe load event while
    // waiting for third-party assets. Never let the loader hide the preview
    // indefinitely; the iframe continues loading after the overlay is gone.
    const timeout = window.setTimeout(() => {
      setLoadStatus("ready");
    }, 6000);

    return () => window.clearTimeout(timeout);
  }, [loadStatus, open, refreshKey]);

  const refresh = () => {
    setLoadStatus("loading");
    setRefreshKey((key) => key + 1);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await previewRef.current?.requestFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by browser or device policy.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={previewRef}
        showCloseButton={false}
        className="inset-0 top-0 left-0 flex h-[100dvh] max-h-none w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-zinc-950 p-0 text-white ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">Preview {title}</DialogTitle>
        <DialogDescription className="sr-only">
          Interactive preview of {title} at {url}
        </DialogDescription>

        <header className="relative z-20 shrink-0 border-b border-white/10 bg-zinc-950/95 px-3 py-2.5 shadow-lg backdrop-blur-xl sm:px-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex shrink-0 items-center gap-1.5" aria-label="Window controls">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close preview"
              />
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Reset to desktop view"
              />
              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Toggle fullscreen preview"
              />
            </div>

            <div className="flex min-w-0 flex-1 items-center rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-zinc-300 shadow-inner">
              <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="truncate" title={url}>{url}</span>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <IconButton label="Refresh preview" onClick={refresh}>
                <RefreshCw className={cn("h-4 w-4", loadStatus === "loading" && "animate-spin")} />
              </IconButton>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${title} in a new tab`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <IconButton label="Toggle fullscreen" onClick={() => void toggleFullscreen()} className="hidden sm:inline-flex">
                <Maximize2 className="h-4 w-4" />
              </IconButton>
              <IconButton label="Close preview" onClick={() => onOpenChange(false)}>
                <X className="h-5 w-5" />
              </IconButton>
            </div>
          </div>

          <div className="mx-auto mt-2 flex w-fit items-center justify-center gap-1 rounded-lg bg-black/25 p-1">
            {(Object.entries(VIEWPORTS) as [Viewport, (typeof VIEWPORTS)[Viewport]][]).map(
              ([key, option]) => {
                const Icon = option.icon;
                const active = viewport === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setViewport(key)}
                    aria-pressed={active}
                    aria-label={option.label}
                    title={option.label}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-zinc-400 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline">{option.label}</span>
                  </button>
                );
              },
            )}
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 justify-center overflow-auto bg-[radial-gradient(circle_at_top,#27272a_0%,#09090b_58%)] p-2 sm:p-4">
          <div
            className="relative h-full max-w-full overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl shadow-black/50 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: VIEWPORTS[viewport].width }}
          >
            {loadStatus === "loading" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
                  <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-lg dark:bg-zinc-800">
                    <LoaderCircle className="h-7 w-7 animate-spin text-primary" />
                    <span className="absolute inset-0 animate-ping rounded-2xl border border-primary/30" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">Loading project preview</p>
                    <p className="mt-1 max-w-xs px-4 text-xs text-zinc-500">Some websites may block embedded previews for security.</p>
                  </div>
                </div>
              </div>
            )}
            <iframe
              key={`${url}-${refreshKey}`}
              src={url}
              title={`${title} live project preview`}
              className="h-full w-full bg-white"
              onLoad={() => setLoadStatus("ready")}
              allow="fullscreen; clipboard-read; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IconButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}
