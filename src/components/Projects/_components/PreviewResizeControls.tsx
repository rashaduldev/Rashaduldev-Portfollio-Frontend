"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewResizeControlsProps {
  width: number;
  maxWidth: number;
  dragging: boolean;
  onWidthChange: (width: number) => void;
  onDraggingChange: (dragging: boolean) => void;
}

const MIN_WIDTH = 320;

export default function PreviewResizeControls({ width, maxWidth, dragging, onWidthChange, onDraggingChange }: PreviewResizeControlsProps) {
  const dragStart = useRef({ x: 0, width: 0, direction: 1 });
  const clamp = (value: number) => Math.round(Math.min(Math.max(MIN_WIDTH, value), maxWidth));

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>, direction: -1 | 1) => {
    dragStart.current = { x: event.clientX, width, direction };
    event.currentTarget.setPointerCapture(event.pointerId);
    onDraggingChange(true);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const delta = (event.clientX - dragStart.current.x) * dragStart.current.direction * 2;
    onWidthChange(clamp(dragStart.current.width + delta));
  };

  const stopDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    onDraggingChange(false);
  };

  return <>
    <span className="pointer-events-none absolute top-2 left-2 z-30 rounded-md border border-white/15 bg-zinc-950/85 px-2 py-1 font-mono text-[11px] font-semibold text-white shadow-lg backdrop-blur-md" aria-live="polite">{width}px</span>
    {([-1, 1] as const).map((direction) => <button
      key={direction}
      type="button"
      aria-label={`Resize preview from the ${direction === -1 ? "left" : "right"}`}
      title="Drag to resize"
      onPointerDown={(event) => startDrag(event, direction)}
      onPointerMove={moveDrag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      className={cn("absolute inset-y-0 z-40 flex w-5 touch-none cursor-ew-resize items-center justify-center text-white/70 outline-none transition hover:bg-primary/25 hover:text-white focus-visible:bg-primary/25 focus-visible:text-white", direction === -1 ? "left-0" : "right-0", dragging && "bg-primary/20")}
    ><GripVertical className="h-6 w-4 drop-shadow" aria-hidden="true" /></button>)}
  </>;
}
