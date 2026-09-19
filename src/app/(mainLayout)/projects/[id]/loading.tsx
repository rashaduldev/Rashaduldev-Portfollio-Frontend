import { LoaderCircle } from "lucide-react";

export default function ProjectDetailsLoading() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-5xl items-center justify-center px-4 py-20">
      <div className="flex flex-col items-center text-center" role="status" aria-live="polite">
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <span className="absolute inset-0 animate-ping rounded-2xl border border-primary/25" aria-hidden="true" />
        </div>
        <p className="mt-5 text-base font-semibold text-foreground">Loading project details</p>
        <p className="mt-1 text-sm text-muted-foreground">Preparing screenshots and project information…</p>
      </div>
    </main>
  );
}
