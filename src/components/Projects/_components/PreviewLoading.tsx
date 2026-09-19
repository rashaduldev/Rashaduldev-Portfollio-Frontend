import { LoaderCircle } from "lucide-react";

export default function PreviewLoading() {
  return <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"><div className="flex flex-col items-center gap-4" role="status" aria-live="polite"><div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-lg dark:bg-zinc-800"><LoaderCircle className="h-7 w-7 animate-spin text-primary" /><span className="absolute inset-0 animate-ping rounded-2xl border border-primary/30" aria-hidden="true" /></div><div className="text-center"><p className="text-sm font-semibold">Loading project preview</p><p className="mt-1 max-w-xs px-4 text-xs text-zinc-500">Some websites may block embedded previews for security.</p></div></div></div>;
}
