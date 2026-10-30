import type { Metadata } from "next";
import Link from "next/link";
import { PackageCard } from "@/components/site/PackageCard";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { PromoCard } from "@/components/site/PromoCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { ServiceCard } from "@/components/site/ServiceCard";
import { WorkModelTable } from "@/components/site/WorkModelTable";
import { ModelPanels } from "@/components/site/process";
import { Button } from "@/components/ui/Button";
import { getPromos, getServices } from "@/lib/api/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Layanan Kami",
  description:
    "Dari sistem internal perusahaan sampai website untuk usaha Anda. Setiap layanan dimulai dari memahami kebutuhan, bukan dari daftar fitur.",
  path: "/layanan",
});

export default async function LayananPage() {
  const [services, promos] = await Promise.all([getServices(), getPromos("active")]);
  const business = services.filter((s) => s.audience === "business");
  const personal = services.filter((s) => s.audience === "personal");
  const web = personal.find((s) => s.slug === "web-development") ?? personal[0];
  const promo = promos.find((p) => p.service?.slug === web?.slug) ?? promos[0];

  return (
    <>
      <PageHero
        eyebrow="Layanan"
        title="Layanan Kami"
        lead="Dari sistem internal perusahaan sampai website untuk usaha Anda. Setiap layanan dimulai dari memahami kebutuhan, bukan dari daftar fitur."
      />

      <section aria-labelledby="perusahaan" className="container-site py-16 lg:py-24">
        <Reveal className="flex flex-col gap-8 lg:gap-12">
          <SectionHead id="perusahaan" eyebrow="Untuk perusahaan" title="Layanan sistem dan konsultasi" />
          {business.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
              {business.map((s) => (
                <li key={s.slug}>
                  <ServiceCard service={s} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-ink-muted">Daftar layanan sedang diperbarui. Silakan hubungi Kami untuk informasi terbaru.</p>
          )}
        </Reveal>
      </section>

      {web ? (
        <section id={web.slug} aria-labelledby="usaha" className="container-site scroll-mt-8 pb-16 lg:pb-24">
          <Reveal className="flex flex-col gap-8 lg:gap-12">
            <SectionHead id="usaha" eyebrow={web.eyebrow || "Untuk usaha & personal"} title={web.title} intro={web.summary} />
            {web.packages.length > 0 ? (
              <ul className="grid items-start gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
                {web.packages.map((p) => (
                  <li key={p.name} className="h-full">
                    <PackageCard pkg={p} serviceSlug={web.slug} />
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <Button href={`/layanan/${web.slug}`} variant="secondary">
                  Lihat detail layanan
                </Button>
              </div>
            )}
            {promo ? (
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="md:w-[400px] md:shrink-0">
                  <PromoCard promo={promo} />
                </div>
                <div className="flex flex-col gap-2 md:pl-8">
                  <p className="text-tagline text-cyan-ink">Promo aktif</p>
                  <p className="max-w-[480px] text-body text-ink-muted">Promo ditampilkan otomatis dari CMS selama periodenya berjalan.</p>
                  <Link href="/promo" className="font-medium text-cyan-ink hover:underline">
                    Lihat semua promo
                  </Link>
                </div>
              </div>
            ) : null}
          </Reveal>
        </section>
      ) : null}

      <section aria-labelledby="model-kerja" className="container-site pb-16 lg:pb-24">
        <Reveal className="flex flex-col gap-8 lg:gap-12">
          <SectionHead id="model-kerja" eyebrow="Model kerja" title="BOS atau BOR, sesuaikan dengan kondisi proyek Anda" />
          <div className="hidden md:block">
            <WorkModelTable />
          </div>
          <div className="md:hidden">
            <ModelPanels />
          </div>
        </Reveal>
      </section>

      <section aria-label="Bantuan memilih layanan" className="container-site pb-16 lg:pb-24">
        <Reveal>
          <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6 lg:w-fit lg:flex-row lg:items-center lg:gap-12 lg:px-12 lg:py-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-title text-ink">Tidak yakin layanan mana yang tepat?</h2>
              <p className="text-body text-ink-muted">Ceritakan masalahnya, Kami bantu identifikasi kebutuhan yang sebenarnya.</p>
            </div>
            <Button href="/diskusi" className="shrink-0">
              Diskusi Kebutuhan Sistem
            </Button>
          </div>
        </Reveal>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Layanan", path: "/layanan" }])} />
    </>
  );
}
