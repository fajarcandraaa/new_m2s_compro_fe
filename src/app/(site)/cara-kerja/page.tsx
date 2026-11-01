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
        <div className="container-narrow">
          <Anim className="max-w-[680px]">
            <SectionHead
              id="lawan"
              eyebrow="Yang kami lawan"
              title="Bukan kompetitor, tapi pola kerja yang keliru"
              intro="Pola ini hampir selalu berakhir sama: waktu terbuang, biaya membengkak, dan sistem akhirnya ditinggalkan."
            />
          </Anim>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {MISCONCEPTIONS.map((t, i) => (
              <Anim
                as="li"
                key={t}
                index={i}
                className="flex items-start gap-5 rounded-2xl border border-line bg-surface p-7 transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-ink-muted"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-muted">
                  <CrossIcon className="h-[18px] w-[18px]" />
                </span>
                <h3 className="text-[18px] leading-[26px] font-medium text-ink">{t}</h3>
              </Anim>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="prinsip" className="section-block">
        <div className="container-narrow">
          <Anim className="max-w-[680px]">
            <SectionHead id="prinsip" eyebrow="Prinsip" title="Cara kami berpikir" />
          </Anim>
          <div className="mt-14 grid border-t border-line md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <Anim
                as="article"
                key={p.number}
                index={i % 2}
                className="principle-card flex flex-col gap-3 border-b border-line py-7 md:px-10 md:py-10 md:odd:pl-0 md:even:border-l md:even:pr-0"
              >
                <span aria-hidden="true" className="outline-number transition-colors duration-300">
                  {p.number}
                </span>
                <h3 className="text-title text-ink">{p.title}</h3>
                <p className="text-body text-ink-muted">{p.body}</p>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="dark" aria-labelledby="tahapan" className="section-block relative overflow-hidden bg-ground">
        <DotField />
        <div className="container-narrow relative">
          <Anim className="max-w-[680px]">
            <SectionHead id="tahapan" eyebrow="Tahapan" title="Empat tahap dari discovery sampai bertumbuh" />
          </Anim>
          <div className="relative mt-14 pl-14 md:pl-[72px]">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-line">
              <span className="anim-fill-y absolute inset-0 block bg-cyan" />
            </span>
            <ol className="flex flex-col gap-10">
              {STEPS.map((s, i) => (
                <Anim
                  as="li"
                  key={s.number}
                  index={i}
                  className="relative grid gap-8 rounded-2xl border border-line bg-surface p-8 transition-[translate,border-color] duration-300 hover:border-cyan md:grid-cols-[5fr_4fr] md:hover:translate-x-2"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-7 -left-14 flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan bg-[#080808] text-[14px] font-semibold text-cyan md:-left-[72px]"
                  >
                    {s.number}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-title text-ink">{s.title}</h3>
                    <p className="text-body text-ink-muted">{s.body}</p>
                  </div>
                  <div className="flex flex-col justify-center gap-1 border-l-2 border-cyan pl-5">
                    <p className="text-tagline tracking-[0.1em] text-cyan-ink uppercase">Output</p>
                    <p className="text-body text-ink">{s.output}</p>
                  </div>
                </Anim>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="dampak" className="section-block">
        <div className="container-narrow">
          <Anim className="max-w-[680px]">
            <SectionHead id="dampak" eyebrow="Kenapa penting" title="Pendekatan ini berdampak langsung pada tiga hal" />
          </Anim>
          <div className="mt-12">
            <WhyTabs />
          </div>
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
