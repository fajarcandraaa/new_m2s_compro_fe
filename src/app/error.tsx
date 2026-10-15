"use client";

import { Button } from "@/components/ui/Button";

/**
 * Root error boundary. Cached ISR pages keep serving when the BE is down; this covers pages that were
 * never cached (e.g. filtered lists) so visitors get a branded page instead of Next's default error.
 */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="konten" data-theme="dark" className="bg-ground">
      <div className="container-site flex min-h-[70vh] flex-col justify-center gap-6 py-16">
        <p className="text-tagline text-cyan-ink">Gangguan sementara</p>
        <h1 className="max-w-[640px] text-display-responsive text-ink">Halaman ini belum bisa dimuat</h1>
        <p className="max-w-[560px] text-body text-ink-muted">Coba muat ulang beberapa saat lagi, atau kembali ke beranda.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button onClick={() => reset()}>Coba Lagi</Button>
          <Button href="/" variant="secondary">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </main>
  );
}
