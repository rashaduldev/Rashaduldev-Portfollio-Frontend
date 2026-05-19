"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DeferRenderProps = {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  fallback?: ReactNode;
};

export default function DeferRender({
  children,
  rootMargin = "200px",
  minHeight = "400px",
  fallback = null,
}: DeferRenderProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldRender(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldRender(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? children : fallback}
    </div>
  );
}
