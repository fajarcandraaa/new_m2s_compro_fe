"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Kirim `page_view` GA4 untuk navigasi client-side (App Router).
 * `<GoogleAnalytics>` hanya memanggil `gtag('config', …)` sekali saat load,
 * jadi tanpa ini perpindahan halaman lewat <Link> tidak tercatat.
 *
 * Load pertama sengaja dilewati: `config` sudah mengirim `page_view` sendiri.
 * ponytail: hanya perubahan pathname yang memicu kirim; navigasi yang cuma
 * mengubah query string tidak dihitung. Tambah `useSearchParams` kalau perlu.
 */
export function AnalyticsPageView() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (!process.env.NEXT_PUBLIC_GA_ID) return;

    sendGAEvent("event", "page_view", {
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
