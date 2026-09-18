"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CloudOff, RefreshCw, ShieldCheck, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function NetworkStatus() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);
  const wasOffline = useRef(false);

  const restoreApp = useCallback(() => {
    const shouldRefresh = wasOffline.current;

    setIsOnline(true);
    setIsChecking(false);
    setRetryFailed(false);
    wasOffline.current = false;

    if (shouldRefresh) {
      router.refresh();
      toast.success("Connection restored. You’re back online.");
    }
  }, [router]);

  useEffect(() => {
    const handleOffline = () => {
      wasOffline.current = true;
      setIsOnline(false);
      setIsChecking(false);
      setRetryFailed(false);
    };

    const handleOnline = () => restoreApp();

    setIsReady(true);
    if (!navigator.onLine) handleOffline();

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [restoreApp]);

  useEffect(() => {
    if (!isReady || isOnline) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOnline, isReady]);

  const retryConnection = async () => {
    if (isChecking) return;

    setIsChecking(true);
    setRetryFailed(false);

    if (!navigator.onLine) {
      setRetryFailed(true);
      setIsChecking(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(window.location.href, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Connection check failed");
      restoreApp();
    } catch {
      setRetryFailed(true);
    } finally {
      window.clearTimeout(timeoutId);
      setIsChecking(false);
    }
  };

  return (
    <AnimatePresence>
      {isReady && !isOnline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-[#06110d] px-4 py-8 text-white"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="offline-title"
          aria-describedby="offline-description"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,211,102,0.08),transparent_60%)]" />
          </div>

          <motion.section
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9"
          >
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              <WifiOff className="h-3.5 w-3.5" />
              Connection interrupted
            </div>

            <div className="relative mx-auto mb-7 grid h-32 w-32 place-items-center" aria-hidden="true">
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-emerald-300/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border border-emerald-400/20"
                animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.8, 0.45] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
                <CloudOff className="h-9 w-9" strokeWidth={1.8} />
              </div>
            </div>

            <h1 id="offline-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
              You’re offline — not out of ideas.
            </h1>
            <p id="offline-description" className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/65 sm:text-base">
              The portfolio is taking a short signal break. Your current page is safe, and it will reconnect automatically when your internet returns.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-200/90">
              <ShieldCheck className="h-4 w-4" />
              No progress or page state will be lost
            </div>

            <button
              type="button"
              onClick={retryConnection}
              disabled={isChecking}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3 font-bold text-[#06110d] shadow-lg shadow-emerald-500/20 transition hover:bg-[#39df78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06110d] disabled:cursor-wait disabled:opacity-70"
            >
              <RefreshCw className={`h-5 w-5 ${isChecking ? "animate-spin" : ""}`} />
              {isChecking ? "Checking connection…" : "Try again"}
            </button>

            <p className={`mt-3 min-h-5 text-sm ${retryFailed ? "text-amber-200" : "text-white/45"}`} aria-live="polite">
              {retryFailed ? "Still offline. I’ll keep watching for your connection." : "Automatic reconnection is active."}
            </p>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
