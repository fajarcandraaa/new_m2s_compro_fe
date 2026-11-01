import type { Metadata } from "next";
import Link from "next/link";
import { DotField } from "@/components/brand/DotField";
import { Anim } from "@/components/site/Anim";
import { BandCta } from "@/components/site/BandCta";
import { CrossIcon } from "@/components/site/Icons";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { WhyTabs } from "@/components/site/WhyTabs";
import { MISCONCEPTIONS, PRINCIPLES } from "@/lib/content/cara-kerja";
import { STEPS } from "@/lib/content/process";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Proses Kerja Kami",
  description:
    "Sebagian besar sistem internal tidak gagal karena teknologinya. Mereka gagal karena bisnis membangun sistem yang salah terlalu cepat.",
  path: "/cara-kerja",
});

export default function CaraKerjaPage() {
  return (
    <>
      <PageHero
        eyebrow="Cara kerja"
        title="Proses Kerja Kami"
        lead="Sebagian besar sistem internal tidak gagal karena teknologinya. Mereka gagal karena bisnis membangun sistem yang salah terlalu cepat."
      />

      <section aria-labelledby="lawan" className="section-block">
        <div className="container-narrow grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Anim className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-4">
              <p className="text-tagline text-cyan-ink">Yang kami lawan</p>
              <h2 id="lawan" className="text-heading text-ink">
                Bukan kompetitor, tapi pola kerja yang keliru
              </h2>
              <p className="text-body text-ink-muted">
                Pola ini hampir selalu berakhir sama: waktu terbuang, biaya membengkak, dan sistem akhirnya ditinggalkan.
              </p>
            </div>
          </Anim>
          <ul className="grid gap-4 sm:grid-cols-2">
            {MISCONCEPTIONS.map((t, i) => (
              <Anim as="li" key={t} index={i} className="flex gap-4 rounded-lg border border-line bg-surface p-6">
                <span className="text-ink-muted">
                  <CrossIcon />
                </span>
                <span className="text-body text-ink">{t}</span>
              </Anim>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="prinsip" className="section-block">
        <div className="container-narrow flex flex-col gap-10">
          <Anim>
            <SectionHead id="prinsip" eyebrow="Prinsip" title="Cara kami berpikir" />
          </Anim>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {PRINCIPLES.map((p, i) => (
              <Anim as="article" key={p.number} index={i} className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-6 lg:p-8">
                <p className="text-tagline text-cyan-ink">{p.number}</p>
                <h3 className="text-title text-ink">{p.title}</h3>
                <p className="text-body text-ink-muted">{p.body}</p>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="dark" aria-labelledby="tahapan" className="section-block relative overflow-hidden bg-ground">
        <DotField />
        <div className="container-narrow relative flex flex-col gap-10">
          <Anim>
            <SectionHead id="tahapan" eyebrow="Tahapan" title="Empat tahap dari discovery sampai bertumbuh" />
          </Anim>
          <ol className="flex flex-col">
            {STEPS.map((s, i) => (
              <Anim
                as="li"
                key={s.number}
                index={i}
                className="grid gap-4 border-t border-line py-8 last:border-b lg:grid-cols-[80px_1fr_260px] lg:gap-8 lg:py-10"
              >
                <span className="text-tagline text-cyan-ink">{s.number}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-title text-ink">{s.title}</h3>
                  <p className="text-body text-ink-muted">{s.body}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-small text-ink">
                        <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-cyan" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="self-start rounded-md border border-line bg-surface p-4">
                  <p className="text-tagline text-ink-muted">Output</p>
                  <p className="mt-1 text-small text-ink">{s.output}</p>
                </div>
              </Anim>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="dampak" className="section-block">
        <div className="container-narrow flex flex-col gap-10">
          <Anim>
            <SectionHead id="dampak" eyebrow="Kenapa penting" title="Pendekatan ini berdampak langsung pada tiga hal" />
          </Anim>
          <WhyTabs />
        </div>
      </section>

      <BandCta
        id="ajakan"
        eyebrow="Ajakan diskusi"
        title="Partner untuk sistem yang stabil dan siap bertumbuh"
        body="Jika Anda mencari pengembangan yang cepat dan murah, kami kemungkinan bukan pilihan yang tepat. Jika Anda mencari partner jangka panjang, mari berdiskusi."
      >
        <Link
          href="/diskusi"
          className="inline-flex min-h-12 items-center rounded-md bg-[#080808] px-6 font-medium text-white transition-colors hover:bg-[#181818]"
        >
          Diskusi Kebutuhan Sistem
        </Link>
      </BandCta>

      <JsonLd data={breadcrumbJsonLd([{ name: "Cara Kerja", path: "/cara-kerja" }])} />
    </>
  );
}
