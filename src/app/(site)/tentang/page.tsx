import type { Metadata } from "next";
import { DotField } from "@/components/brand/DotField";
import { Anim } from "@/components/site/Anim";
import { BandCta } from "@/components/site/BandCta";
import { JsonLd } from "@/components/site/JsonLd";
import { StarIcon } from "@/components/site/Icons";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSite } from "@/lib/api/public";
import { FOUNDED, JOURNEY, SHOW_JOURNEY, SHOW_TEAM, STORY_BODY, STORY_CLOSING, STORY_LEAD, TEAM, VALUES } from "@/lib/content/tentang";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { siteWhatsappUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Tentang Kami",
  description: "Mengubah ide menjadi sistem yang menyelesaikan masalah bisnis nyata. Mind2Screen, berdiri di Malang sejak Januari 2024.",
  path: "/tentang",
});

export default async function TentangPage() {
  const site = await getSite();
  const showTeam = SHOW_TEAM && TEAM.length > 0;
  const showJourney = SHOW_JOURNEY && JOURNEY.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Mengubah ide menjadi sistem yang menyelesaikan masalah bisnis nyata"
        lead={`${site.legalName}, berdiri ${FOUNDED.note.replace(/\.$/, "").replace(/^Di /, "di ")} sejak ${FOUNDED.label}.`}
      />

      <section aria-labelledby="cerita" className="section-block">
        <div className="container-narrow grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Anim>
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <p className="text-tagline text-cyan-ink">Cerita kami</p>
              <h2 id="cerita" className="text-heading text-ink">
                Berawal dari keyakinan bahwa teknologi seharusnya menghadirkan kepastian
              </h2>
            </div>
          </Anim>
          <Anim index={1} className="flex flex-col gap-4 text-body text-ink-muted">
            <p>{STORY_LEAD}</p>
            <p>{STORY_BODY}</p>
            <div className="flex flex-wrap items-center gap-5 rounded-lg border border-line bg-surface p-6">
              <StarIcon className="h-11 w-11 shrink-0 text-cyan" />
              <span aria-hidden="true" className="relative h-0.5 min-w-8 flex-1 bg-cyan">
                <span className="absolute -top-[5px] right-0 h-3 w-3 rotate-45 border-t-2 border-r-2 border-cyan" />
              </span>
              <span aria-hidden="true" className="h-[52px] w-11 shrink-0 bg-[linear-gradient(135deg,#30c2db,#43f4fa)] [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
              <p className="basis-full text-body text-ink">{STORY_CLOSING}</p>
            </div>
          </Anim>
        </div>
      </section>

      <section data-theme="dark" aria-labelledby="nilai" className="section-block relative overflow-hidden bg-ground">
        <DotField />
        <div className="container-narrow relative">
          <Anim className="max-w-[640px]">
            <SectionHead id="nilai" eyebrow="Nilai" title="Lima nilai yang kami pegang" />
          </Anim>
          <div className="mt-14 flex flex-col gap-4 lg:min-h-[320px] lg:flex-row">
            {VALUES.map((v, i) => (
              <Anim
                as="article"
                key={v.number}
                index={i}
                className="flex min-w-0 flex-1 basis-0 flex-col justify-between gap-6 rounded-2xl border border-line bg-surface px-6 py-7 transition-[flex-grow,border-color] duration-300 lg:hover:grow-[1.8] lg:hover:border-cyan"
              >
                <p className="text-tagline tracking-[0.1em] text-cyan-ink">{v.number}</p>
                <div>
                  <h3 className="text-title text-ink">{v.title}</h3>
                  <p className="mt-2 text-small text-ink-muted">{v.body}</p>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      {/* Tim dan perjalanan di-hide sampai sumber datanya tersedia (lihat lib/content/tentang.ts). */}
      {showJourney ? (
        <section aria-labelledby="perjalanan" className="section-block">
          <div className="container-narrow flex flex-col gap-10">
            <Anim>
              <SectionHead id="perjalanan" eyebrow="Perjalanan" title="Perjalanan kami" />
            </Anim>
            <ol className="flex flex-col">
              {JOURNEY.map((m, i) => (
                <Anim
                  as="li"
                  key={m.title}
                  index={i}
                  className="grid gap-3 border-t border-line py-6 last:border-b lg:grid-cols-[200px_1fr] lg:gap-8"
                >
                  <p className="text-tagline text-cyan-ink">{m.when}</p>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-title text-ink">{m.title}</h3>
                    <p className="text-body text-ink-muted">{m.body}</p>
                  </div>
                </Anim>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {showTeam ? (
        <section aria-labelledby="tim" className="section-block">
          <div className="container-narrow flex flex-col gap-10">
            <Anim>
              <SectionHead id="tim" eyebrow="Tim" title="Orang-orang di balik Mind2Screen" />
            </Anim>
            <ul className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {TEAM.map((p, i) => (
                <Anim as="li" key={p.name} index={i} className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-6">
                  <p className="text-title text-ink">{p.name}</p>
                  <p className="text-small text-ink-muted">{p.role}</p>
                </Anim>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-label="Kantor dan kontak" className="section-block">
        <div className="container-narrow grid items-start gap-4 md:grid-cols-2 md:gap-6">
          <Anim className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6 lg:p-8">
            <p className="text-tagline text-cyan-ink">Kantor</p>
            <h2 className="text-title text-ink">{site.legalName}</h2>
            {site.mapsUrl ? (
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-body text-ink-muted hover:text-cyan-ink">
                {site.address}
              </a>
            ) : (
              <p className="text-body text-ink-muted">{site.address}</p>
            )}
          </Anim>
          <Anim index={1} className="flex flex-col gap-4 rounded-lg bg-[#080808] p-6 [--ink:#ffffff] [--ink-muted:#a3a3a3] lg:p-8">
            <p className="text-tagline text-cyan-ink">Berdiri sejak</p>
            <p className="text-display-responsive text-ink">{FOUNDED.label}</p>
            <p className="text-body text-ink-muted">{FOUNDED.note}</p>
          </Anim>
        </div>
      </section>

      <BandCta
        id="ajakan-tentang"
        eyebrow="Mari bekerja sama"
        title="Ceritakan sistem yang ingin Anda bangun"
        body="Sesi diskusi awal tanpa biaya. Kami bantu petakan masalah dan langkah berikutnya."
      >
        <WhatsAppButton href={siteWhatsappUrl(site)} source="tentang">
          Chat via WhatsApp
        </WhatsAppButton>
      </BandCta>

      <JsonLd data={breadcrumbJsonLd([{ name: "Tentang", path: "/tentang" }])} />
    </>
  );
}
