"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function MainLayoutError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container flex min-h-[65vh] items-center justify-center px-4 py-20">
      <section className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-primary" aria-hidden="true" />
        <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page could not be loaded. Please try again.</p>
        <button type="button" onClick={reset} className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </section>
    </main>
  );
}
