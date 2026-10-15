import type { Metadata } from "next";
import { DotField } from "@/components/brand/DotField";
import { BrandScreen } from "@/components/brand/BrandScreen";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/Button";
import { getSite } from "@/lib/api/public";

export const metadata: Metadata = { title: "Halaman tidak ditemukan", robots: { index: false } };

/** Real 404 (HTTP 404 status) for unknown routes and missing slugs. */
export default async function NotFound() {
  const site = await getSite().catch(() => null);
  return (
    <>
      <Header />
      <main id="konten">
        <section data-theme="dark" className="relative overflow-hidden bg-ground">
          <DotField />
          <div aria-hidden="true" className="absolute inset-0 mx-auto hidden max-w-[1440px] md:block">
            <BrandScreen className="absolute top-[79px] right-[170px] h-[468px] w-[180px]" />
            <BrandScreen className="absolute top-[19px] right-[-70px] h-[572px] w-[220px]" />
          </div>
          <div className="relative container-site flex min-h-[60vh] flex-col justify-center gap-6 py-16">
            <p className="text-tagline text-cyan-ink">404</p>
            <h1 className="max-w-[640px] text-display-responsive text-ink">Halaman yang Anda cari tidak ditemukan</h1>
            <p className="max-w-[560px] text-body text-ink-muted">
              Tautan mungkin sudah berubah atau konten sudah tidak dipublikasikan. Kembali ke beranda atau ceritakan kebutuhan Anda
              kepada Kami.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Button href="/">Kembali ke Beranda</Button>
              <Button href="/diskusi" variant="secondary">
                Diskusi Kebutuhan Sistem
              </Button>
            </div>
          </div>
        </section>
      </main>
      {site ? <Footer site={site} /> : null}
    </>
  );
}
