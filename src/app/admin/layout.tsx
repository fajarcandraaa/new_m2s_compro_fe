import type { Metadata } from "next";
import { AdminProviders } from "@/components/admin/Providers";

export const metadata: Metadata = {
  title: { default: "CMS", template: "%s | Mind2Screen CMS" },
  robots: { index: false, follow: false },
};

/** CMS: light theme only, client-side data via TanStack Query. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" className="min-h-screen bg-ground text-ink">
      <AdminProviders>{children}</AdminProviders>
    </div>
  );
}
