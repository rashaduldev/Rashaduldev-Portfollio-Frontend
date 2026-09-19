import type { ComponentType, ReactNode } from "react";
import { ExternalLink, Maximize2, Monitor, RefreshCw, Smartphone, Tablet, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PreviewViewport = "desktop" | "tablet" | "mobile";
export const PREVIEW_VIEWPORTS: Record<PreviewViewport, { label: string; width: string; icon: ComponentType<{ className?: string }> }> = {
  desktop: { label: "Desktop", width: "100%", icon: Monitor },
  tablet: { label: "Tablet", width: "768px", icon: Tablet },
  mobile: { label: "Mobile", width: "375px", icon: Smartphone },
};

interface Props { title: string; url: string; viewport: PreviewViewport; loading: boolean; onViewportChange: (value: PreviewViewport) => void; onRefresh: () => void; onFullscreen: () => void; onClose: () => void; }

export default function PreviewToolbar({ title, url, viewport, loading, onViewportChange, onRefresh, onFullscreen, onClose }: Props) {
  return <header className="relative z-20 shrink-0 border-b border-white/10 bg-zinc-950/95 px-3 py-2.5 shadow-lg backdrop-blur-xl sm:px-4">
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <div className="flex shrink-0 items-center gap-1.5" aria-label="Window controls">
        <DotButton label="Close preview" className="bg-[#ff5f57]" onClick={onClose} />
        <DotButton label="Reset to desktop view" className="bg-[#febc2e]" onClick={() => onViewportChange("desktop")} />
        <DotButton label="Toggle fullscreen preview" className="bg-[#28c840]" onClick={onFullscreen} />
      </div>
      <div className="flex min-w-0 flex-1 items-center rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-zinc-300 shadow-inner"><span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" /><span className="truncate" title={url}>{url}</span></div>
      <div className="flex shrink-0 items-center gap-1">
        <IconButton label="Refresh preview" onClick={onRefresh}><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /></IconButton>
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title} in a new tab`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ExternalLink className="h-4 w-4" /></a>
        <IconButton label="Toggle fullscreen" onClick={onFullscreen} className="hidden sm:inline-flex"><Maximize2 className="h-4 w-4" /></IconButton>
        <IconButton label="Close preview" onClick={onClose}><X className="h-5 w-5" /></IconButton>
      </div>
    </div>
    <div className="mx-auto mt-2 flex w-fit items-center justify-center gap-1 rounded-lg bg-black/25 p-1">
      {(Object.entries(PREVIEW_VIEWPORTS) as [PreviewViewport, (typeof PREVIEW_VIEWPORTS)[PreviewViewport]][]).map(([key, option]) => { const Icon = option.icon; return <button key={key} type="button" onClick={() => onViewportChange(key)} aria-pressed={viewport === key} aria-label={option.label} title={option.label} className={cn("inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", viewport === key ? "bg-primary text-primary-foreground shadow-sm" : "text-zinc-400 hover:bg-white/10 hover:text-white")}><Icon className="h-3.5 w-3.5" /><span className="hidden lg:inline">{option.label}</span></button>; })}
    </div>
  </header>;
}

function DotButton({ label, className, onClick }: { label: string; className: string; onClick: () => void }) { return <button type="button" onClick={onClick} className={cn("h-3 w-3 rounded-full ring-1 ring-black/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white", className)} aria-label={label} />; }
function IconButton({ label, onClick, className, children }: { label: string; onClick: () => void; className?: string; children: ReactNode }) { return <button type="button" onClick={onClick} aria-label={label} title={label} className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", className)}>{children}</button>; }
