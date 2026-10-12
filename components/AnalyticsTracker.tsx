"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double-tracking exact same path consecutively
    const currentFull = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (lastTrackedPath.current === currentFull) return;
    lastTrackedPath.current = currentFull;

    // Skip admin pages
    if (pathname.startsWith("/admin")) return;

    const utmSource = searchParams?.get("utm_source") || undefined;
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    const payload = {
      path: pathname,
      referrer,
      utm_source: utmSource,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  }, [pathname, searchParams]);

  return null;
}
