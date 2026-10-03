"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const identity = (storage: Storage, key: string) => {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  storage.setItem(key, value);
  return value;
};

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const track = () => {
      try {
        if (localStorage.getItem("cookieConsent") !== "accepted") return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl || pathname.startsWith("/dashboard") || pathname === "/login") return;

        void fetch(`${apiUrl}/analytics/track`, {
          method: "POST",
          credentials: "include",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
            "X-Visitor-ID": identity(localStorage, "portfolio_visitor_id"),
            "X-Session-ID": identity(sessionStorage, "portfolio_session_id"),
          },
          body: JSON.stringify({ path: pathname, referrer: document.referrer }),
        }).catch(() => {
          // Privacy tools may intentionally block this request.
        });
      } catch {
        // Disabled storage or privacy tools must never break the page.
      }
    };

    track();
    window.addEventListener("analytics-consent", track);
    return () => window.removeEventListener("analytics-consent", track);
  }, [pathname]);

  return null;
}
