import type { Metadata } from "next";
import { Suspense } from "react";
import { DiskusiForm, DiskusiFormWithParams } from "@/components/site/DiskusiForm";
import { PageHero } from "@/components/site/PageHero";
import { Step } from "@/components/site/Step";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getServices, getSite } from "@/lib/api/public";
import { pageMetadata } from "@/lib/seo";
import { siteWhatsappUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Diskusi Kebutuhan",
  description: "Isi brief singkat. Brief masuk ke tim Kami, lalu Kami hubungi Anda untuk menjadwalkan sesi diskusi.",
  path: "/diskusi",
});

const NEXT = [
  { number: "01", title: "Kami pelajari brief Anda", body: "Tim Kami membaca brief dan menyiapkan pertanyaan lanjutan." },
  { number: "02", title: "Sesi diskusi", body: "Kami petakan masalah, proses yang berjalan, dan prioritasnya bersama tim Anda." },
  { number: "03", title: "Rekomendasi langkah berikutnya", body: "Usulan ruang lingkup dan model kerja yang cocok: BOS atau BOR." },
];

export const revalidate = 300;

export default async function DiskusiPage() {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  const wa = siteWhatsappUrl(site);
  const options = services.map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <>
      <PageHero
        eyebrow="Diskusi kebutuhan"
        title="Ceritakan sistem yang ingin Anda rapikan"
        lead="Isi brief singkat di bawah. Brief masuk ke tim Kami, lalu Kami hubungi Anda untuk menjadwalkan sesi diskusi."
      />
      <div className="container-site py-16 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
          <div className="min-w-0 flex-1 lg:max-w-[804px]">
            <Suspense fallback={<DiskusiForm services={options} whatsappHref={wa} />}>
              <DiskusiFormWithParams services={options} whatsappHref={wa} />
            </Suspense>
          </div>
          <aside className="flex flex-col gap-6 lg:w-[380px] lg:shrink-0" aria-label="Kontak lain">
            <div className="flex flex-col gap-4 rounded-lg border-2 border-cyan bg-surface p-6 lg:p-8">
              <h2 className="text-title text-ink">Lebih suka ngobrol langsung?</h2>
              <p className="hidden text-small text-ink-muted lg:block">Chat tim Kami lewat WhatsApp di {site.whatsappDisplay}.</p>
              <Button href={wa} variant="secondary" className="w-full">
                Chat via WhatsApp
              </Button>
            </div>
            <Card className="hidden flex-col gap-4 p-6 lg:flex lg:p-8">
              <div>
                <p className="text-small text-ink-muted">Email</p>
                <a href={`mailto:${site.email}`} className="text-body text-ink hover:text-cyan-ink">
                  {site.email}
                </a>
              </div>
              <div>
                <p className="text-small text-ink-muted">Alamat</p>
                <p className="text-body text-ink">{site.address}</p>
              </div>
            </Card>
          </aside>
        </div>
      </div>
      <section aria-labelledby="setelah" className="container-site pb-16 lg:pb-24">
        <h2 id="setelah" className="text-tagline text-cyan-ink">
          Setelah brief terkirim
        </h2>
        <ol className="mt-8 grid gap-6 md:mt-12 md:grid-cols-3">
          {NEXT.map((s) => (
            <li key={s.number}>
              <Step {...s} />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
