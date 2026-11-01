import type { Metadata } from "next";
import Link from "next/link";
import { Anim } from "@/components/site/Anim";
import { BandCta } from "@/components/site/BandCta";
import { JsonLd } from "@/components/site/JsonLd";
import { PackageCard } from "@/components/site/PackageCard";
import { PageHero } from "@/components/site/PageHero";
import { PromoCard } from "@/components/site/PromoCard";
import { SectionHead } from "@/components/site/SectionHead";
import { ServiceCard } from "@/components/site/ServiceCard";
import { Button } from "@/components/ui/Button";
import { getPromos, getServices } from "@/lib/api/public";
import { WORK_MODEL_ROWS } from "@/lib/content/process";
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
        <div className="container-narrow flex flex-col gap-10">
          <Anim>
            <SectionHead id="perusahaan" eyebrow="Untuk perusahaan" title="Layanan sistem dan konsultasi" />
          </Anim>

          {featured ? (
            <>
              <Anim as="article" className="grid overflow-hidden rounded-lg border border-line bg-surface lg:grid-cols-[7fr_5fr]">
                <div className="flex flex-col gap-5 p-6 lg:p-12">
                  <p className="text-tagline text-cyan-ink">{featured.eyebrow || featured.tagline}</p>
                  <h3 className="text-display-responsive text-ink">{featured.title}</h3>
                  <p className="max-w-[560px] text-body text-ink-muted">{featured.summary}</p>
                  {featured.points.length > 0 ? (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {featured.points.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-[10px] h-2 w-2 shrink-0 bg-cyan [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
                          <span className="text-small text-ink">{p}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <Link
                    href={`/layanan/${featured.slug}`}
                    className="mt-2 inline-flex min-h-12 w-fit items-center rounded-md bg-cyan px-6 font-medium text-on-cyan transition-colors hover:bg-cyan-glow"
                  >
                    Lihat detail layanan
                    <span className="sr-only">: {featured.title}</span>
                  </Link>
                </div>
                <div aria-hidden="true" className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#30c2db,#43f4fa)] lg:block">
                  <span className="absolute -bottom-12 -left-12 h-64 w-52 bg-white/25 [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
                  <span className="absolute top-12 right-12 h-40 w-28 rounded-lg border-2 border-[#080808]/20" />
                </div>
              </Anim>

              {others.length > 0 ? (
                <ul className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {others.map((s, i) => (
                    <Anim as="li" key={s.slug} index={i} className="h-full">
                      <ServiceCard service={s} />
                    </Anim>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <p className="text-body text-ink-muted">Daftar layanan sedang diperbarui. Silakan hubungi kami untuk informasi terbaru.</p>
          )}
        </div>
      </section>

      {web ? (
        <section id={web.slug} aria-labelledby="usaha" className="section-block scroll-mt-8">
          <div className="container-narrow flex flex-col gap-10">
            <Anim>
              <SectionHead id="usaha" eyebrow={web.eyebrow || "Untuk usaha & personal"} title={web.title} intro={web.summary} />
            </Anim>
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
              <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center">
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
        <div className="container-narrow flex flex-col gap-10">
          <Anim>
            <SectionHead id="model-kerja" eyebrow="Model kerja" title="BOS atau BOR, sesuaikan dengan kondisi proyek Anda" />
          </Anim>
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Perbandingan model kerja BOS dan BOR</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[200px] px-6 py-5 text-tagline text-ink-muted lg:pl-8">
                    Aspek
                  </th>
                  <th scope="col" className="px-6 py-5">
                    <span className="text-tagline text-cyan-ink">BOS</span>
                    <span className="mt-1 block text-title text-ink">Based on Scope</span>
                  </th>
                  <th scope="col" className="px-6 py-5 lg:pr-8">
                    <span className="text-tagline text-cyan-ink">BOR</span>
                    <span className="mt-1 block text-title text-ink">Based on Request</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {WORK_MODEL_ROWS.map(([aspect, bos, bor]) => (
                  <tr key={aspect} className="border-t border-line align-top">
                    <th scope="row" className="px-6 py-5 text-small font-normal text-ink-muted lg:pl-8">
                      {aspect}
                    </th>
                    <td className="px-6 py-5 text-body text-ink">{bos}</td>
                    <td className="px-6 py-5 text-body text-ink lg:pr-8">{bor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
