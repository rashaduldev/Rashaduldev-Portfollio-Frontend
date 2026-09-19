"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import PreviewLoading from "./_components/PreviewLoading";
import PreviewResizeControls from "./_components/PreviewResizeControls";
import PreviewToolbar, { PREVIEW_VIEWPORTS, type PreviewViewport } from "./_components/PreviewToolbar";

interface ProjectPreviewModalProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; url: string; }

export default function ProjectPreviewModal({ open, onOpenChange, title, url }: ProjectPreviewModalProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const automaticRetryAttempted = useRef(false);
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [renderedWidth, setRenderedWidth] = useState(0);
  const [maximumWidth, setMaximumWidth] = useState(320);
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    if (!open) return;
    automaticRetryAttempted.current = false;
    setViewport("desktop");
    setCustomWidth(null);
    setLoading(true);
  }, [open, url]);

  useEffect(() => {
    if (!open) return;
    let observer: ResizeObserver | undefined;
    const animationFrame = window.requestAnimationFrame(() => {
      const frame = frameRef.current;
      const area = previewAreaRef.current;
      if (!frame || !area) return;
      const updateDimensions = () => {
        setRenderedWidth(Math.round(frame.getBoundingClientRect().width));
        setMaximumWidth(Math.max(320, area.clientWidth - 16));
      };
      updateDimensions();
      observer = new ResizeObserver(updateDimensions);
      observer.observe(frame);
      observer.observe(area);
    });
    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
    };
  }, [open]);

  useEffect(() => {
    if (!open || !loading) return;
    const recoveryTimeout = window.setTimeout(() => {
      if (automaticRetryAttempted.current) return;
      automaticRetryAttempted.current = true;
      setRefreshKey((key) => key + 1);
    }, 2500);
    const fallbackTimeout = window.setTimeout(() => setLoading(false), 9000);
    return () => {
      window.clearTimeout(recoveryTimeout);
      window.clearTimeout(fallbackTimeout);
    };
  }, [loading, open, refreshKey]);

  const refresh = () => {
    automaticRetryAttempted.current = true;
    setLoading(true);
    setRefreshKey((key) => key + 1);
  };
  const changeViewport = (value: PreviewViewport) => {
    setViewport(value);
    setCustomWidth(null);
  };
  const resizePreview = (width: number) => {
    setCustomWidth(width);
    setViewport(width <= 480 ? "mobile" : width <= 1024 ? "tablet" : "desktop");
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await previewRef.current?.requestFullscreen();
    } catch { return; }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={previewRef} showCloseButton={false} className="inset-0 top-0 left-0 flex h-[100dvh] max-h-none w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-zinc-950 p-0 text-white ring-0 sm:max-w-none">
        <DialogTitle className="sr-only">Preview {title}</DialogTitle>
        <DialogDescription className="sr-only">Interactive preview of {title} at {url}</DialogDescription>
        <PreviewToolbar title={title} url={url} viewport={viewport} loading={loading} onViewportChange={changeViewport} onRefresh={refresh} onFullscreen={() => void toggleFullscreen()} onClose={() => onOpenChange(false)} />
        <div ref={previewAreaRef} className="relative flex min-h-0 flex-1 justify-center overflow-auto bg-[radial-gradient(circle_at_top,#27272a_0%,#09090b_58%)] p-2 sm:p-4">
          <div ref={frameRef} className={cn("relative h-full max-w-full overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl shadow-black/50 ease-[cubic-bezier(0.16,1,0.3,1)]", dragging ? "transition-none" : "transition-[width] duration-500")} style={{ width: customWidth ?? PREVIEW_VIEWPORTS[viewport].width }}>
            <PreviewResizeControls width={renderedWidth} maxWidth={maximumWidth} dragging={dragging} onWidthChange={resizePreview} onDraggingChange={setDragging} />
            {dragging && <div className="absolute inset-0 z-30 cursor-ew-resize" aria-hidden="true" />}
            {loading && <PreviewLoading />}
            <iframe key={`${url}-${refreshKey}`} src={url} title={`${title} live project preview`} className="h-full w-full bg-white" onLoad={() => setLoading(false)} allow="fullscreen; clipboard-read; clipboard-write" referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
