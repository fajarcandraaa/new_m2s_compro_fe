import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Anim } from "@/components/site/Anim";
import { BandCta } from "@/components/site/BandCta";
import { StarIcon } from "@/components/site/Icons";
import { JsonLd } from "@/components/site/JsonLd";
import { PackageCard } from "@/components/site/PackageCard";
import { PageHero } from "@/components/site/PageHero";
import { PromoCard } from "@/components/site/PromoCard";
import { SectionHead } from "@/components/site/SectionHead";
import { ServiceCard } from "@/components/site/ServiceCard";
import { Button } from "@/components/ui/Button";
import { getPromos, getServices } from "@/lib/api/public";
import { cn } from "@/lib/cn";
import { WORK_MODEL_ROWS, WORK_MODELS } from "@/lib/content/process";
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
  const [featured, ...others] = business;
  const web = personal.find((s) => s.slug === "web-development") ?? personal[0];
  const promo = promos.find((p) => p.service?.slug === web?.slug) ?? promos[0];

  return (
    <>
      <PageHero
        eyebrow="Layanan"
        title="Layanan Kami"
        lead="Dari sistem internal perusahaan sampai website untuk usaha Anda. Setiap layanan dimulai dari memahami kebutuhan, bukan dari daftar fitur."
      />

      <section aria-labelledby="perusahaan" className="section-block">
        <div className="container-narrow">
          <Anim>
            <SectionHead id="perusahaan" eyebrow="Untuk perusahaan" title="Layanan sistem dan konsultasi" />
          </Anim>

          {featured ? (
            <>
              <Anim
                as="article"
                className="relative mt-12 grid overflow-hidden rounded-2xl bg-[#080808] p-7 transition-[translate] duration-300 hover:-translate-y-1.5 [--cyan-ink:#30c2db] [--ink:#ffffff] [--ink-muted:#a3a3a3] [--line:#333333] lg:grid-cols-2 lg:gap-12 lg:p-12"
              >
                <StarIcon className="anim-drift absolute top-10 right-12 h-12 w-12 text-cyan" />
                <span
                  aria-hidden="true"
                  className="absolute right-[-30px] bottom-[-40px] h-[190px] w-[140px] bg-[linear-gradient(135deg,#30c2db,#43f4fa)] opacity-90 [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]"
                />
                <div className="flex flex-col items-start gap-4">
                  <p className="rounded-[4px] border border-line px-2.5 py-0.5 text-[13px] leading-[22px] font-medium tracking-[0.06em] text-cyan-ink uppercase">
                    {featured.eyebrow || "Utama"}
                  </p>
                  <h3 className="text-[32px] leading-[40px] font-semibold text-ink">{featured.title}</h3>
                  <p className="text-body text-ink-muted">{featured.summary}</p>
                  {featured.priceValue ? (
                    <p className="text-small text-ink">
                      {featured.priceLabel ? <span className="text-ink-muted">{featured.priceLabel}: </span> : null}
                      {featured.priceValue}
                    </p>
                  ) : null}
                  <Link href={`/layanan/${featured.slug}`} className="font-medium text-cyan-ink hover:underline">
                    Lihat detail layanan<span aria-hidden="true"> &rarr;</span>
                    <span className="sr-only">: {featured.title}</span>
                  </Link>
                </div>
                {featured.points.length > 0 ? (
                  <ul className="relative z-[1] mt-6 flex flex-col justify-center gap-3 lg:mt-0">
                    {featured.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-body text-ink">
                        <span aria-hidden="true" className="mt-[9px] h-2 w-2 shrink-0 bg-cyan [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Anim>

              {others.length > 0 ? (
                <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {others.map((s, i) => (
                    <Anim as="li" key={s.slug} index={i} className="h-full">
                      <ServiceCard service={s} />
                    </Anim>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <p className="mt-10 text-body text-ink-muted">Daftar layanan sedang diperbarui. Silakan hubungi kami untuk informasi terbaru.</p>
          )}
        </div>
      </section>

      {web ? (
        <section id={web.slug} aria-labelledby="usaha" className="section-block scroll-mt-8">
          <div className="container-narrow flex flex-col">
            <Anim>
              <div className="flex flex-wrap items-end justify-between gap-6 lg:gap-16">
                <div className="max-w-[520px]">
                  <p className="mb-3 text-tagline text-cyan-ink">{web.eyebrow || "Untuk usaha & personal"}</p>
                  <h2 id="usaha" className="text-[32px] leading-[40px] font-semibold text-ink">
                    {web.title}
                  </h2>
                </div>
                <p className="max-w-[480px] text-body text-ink-muted">{web.summary}</p>
              </div>
            </Anim>
            {web.packages.length > 0 ? (
              <ul className="mt-14 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
                {web.packages.map((p, i) => (
                  <Anim as="li" key={p.name} index={i} className="h-full">
                    <PackageCard pkg={p} serviceSlug={web.slug} />
                  </Anim>
                ))}
              </ul>
            ) : (
              <div className="mt-10">
                <Button href={`/layanan/${web.slug}`} variant="secondary">
                  Lihat detail layanan
                </Button>
              </div>
            )}
            {promo ? (
              <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center">
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
          </div>
        </section>
      ) : null}

      <section aria-labelledby="model-kerja" className="section-block">
        <div className="container-narrow">
          <Anim>
            <SectionHead id="model-kerja" eyebrow="Model kerja" title="BOS atau BOR, sesuaikan dengan kondisi proyek Anda" />
          </Anim>
          <Anim className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface">
            <div role="table" aria-label="Perbandingan model kerja BOS dan BOR">
              <div role="row" className="hidden lg:grid lg:grid-cols-[1.1fr_1.5fr_1.5fr]">
                <div role="columnheader" />
                {WORK_MODELS.map((m) => (
                  <div
                    key={m.key}
                    role="columnheader"
                    className={cn("flex flex-col gap-0.5 px-6 py-6", m.key === "bos" && "bg-[rgba(48,194,219,.12)]")}
                  >
                    <span className="font-semibold text-ink">{m.label}</span>
                    <span className="text-small font-normal text-ink-muted">{m.short}</span>
                  </div>
                ))}
              </div>
              {WORK_MODEL_ROWS.map(([aspect, bos, bor], i) => (
                <div
                  key={aspect}
                  role="row"
                  className="anim-slide grid border-t border-line lg:grid-cols-[1.1fr_1.5fr_1.5fr]"
                  style={{ "--i": i } as CSSProperties}
                >
                  <div role="rowheader" className="px-5 pt-4 text-small font-medium text-ink-muted lg:px-6 lg:py-5">
                    {aspect}
                  </div>
                  <div role="cell" className="bg-[rgba(48,194,219,.12)] px-5 py-1 text-body text-ink lg:px-6 lg:py-5">
                    <span className="sr-only">BOS: </span>
                    {bos}
                  </div>
                  <div role="cell" className="px-5 pt-1 pb-4 text-body text-ink lg:px-6 lg:py-5">
                    <span className="sr-only">BOR: </span>
                    {bor}
                  </div>
                </div>
              ))}
            </div>
          </Anim>
        </div>
      </section>

      <BandCta
        id="bantuan-layanan"
        eyebrow="Bantuan memilih"
        title="Tidak yakin layanan mana yang tepat?"
        body="Ceritakan masalahnya, kami bantu identifikasi kebutuhan yang sebenarnya."
      >
        <Link
          href="/diskusi"
          className="inline-flex min-h-12 items-center rounded-md bg-[#080808] px-6 font-medium text-white transition-colors hover:bg-[#181818]"
        >
          Diskusi Kebutuhan Sistem
        </Link>
      </BandCta>

      <JsonLd data={breadcrumbJsonLd([{ name: "Layanan", path: "/layanan" }])} />
    </>
  );
}
