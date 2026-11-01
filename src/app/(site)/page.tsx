import type { Metadata } from "next";
import Link from "next/link";
import { DotField } from "@/components/brand/DotField";
import { Hero } from "@/components/home/Hero";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { Anim } from "@/components/site/Anim";
import { BandCta } from "@/components/site/BandCta";
import { BentoTile } from "@/components/site/BentoTile";
import { CaseTabs } from "@/components/site/CaseTabs";
import { ClosingCta } from "@/components/site/ClosingCta";
import { CheckIcon, CrossIcon, StarIcon } from "@/components/site/Icons";
import { ModelSwitch } from "@/components/site/ModelSwitch";
import { ProcessStepper } from "@/components/site/ProcessStepper";
import { SectionHead } from "@/components/site/SectionHead";
import { FIT_NO, FIT_YES, PROBLEMS, SYSTEMS } from "@/lib/content/home";
import { getCaseStudies, getClientLogos, getPromos, getServices, getSite, getTestimonials } from "@/lib/api/public";
import { pageMetadata } from "@/lib/seo";
import { siteWhatsappUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Mind2Screen | Partner Sistem Internal B2B",
    description:
      "Kami membangun HRIS, DMS, dan portal internal yang modular dan terdokumentasi. Kami mulai dari memahami cara kerja tim Anda, bukan langsung menulis kode.",
    path: "/",
  }),
  title: { absolute: "Mind2Screen | Partner Sistem Internal B2B" },
};

export default async function HomePage() {
  const [site, logos, featured, testimonials, services, activePromos] = await Promise.all([
    getSite(),
    getClientLogos(),
    getCaseStudies(true),
    getTestimonials(3),
    getServices(),
    getPromos("active"),
  ]);

  // Business rules (Figma annotation 42:6523): render only when the CMS toggle is on AND content exists.
  const showLogos = site.showClientLogos && logos.length > 0;
  const showTestimonials = site.showTestimonials && testimonials.length > 0;
  const web = services.find((s) => s.slug === "web-development");
  const webPrice = web?.priceValue ? ` mulai ${web.priceValue}` : "";

  return (
    <>
      <Hero logos={showLogos ? logos : []} />

      {/* 2. Masalah: kolom kiri menempel, daftar bernomor di kanan */}
      <section aria-labelledby="masalah" className="section-block">
        <div className="container-narrow grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Anim className="lg:sticky lg:top-24 lg:self-start">
            <SectionHead
              id="masalah"
              eyebrow="Masalah"
              title="Sebagian besar sistem internal gagal sebelum baris kode pertama ditulis"
              intro="Akar masalahnya jarang di teknologi. Biasanya kebutuhan tidak dipetakan dengan jelas dan struktur sistemnya tidak dirancang untuk berubah."
            />
          </Anim>
          <ul className="flex flex-col">
            {PROBLEMS.map((p, i) => (
              <Anim
                key={p.number}
                as="li"
                variant="slide"
                index={i}
                className="group relative grid grid-cols-[56px_1fr] gap-5 border-t border-line py-8 transition-[padding-left] duration-300 last:border-b hover:pl-3 lg:grid-cols-[96px_1fr] lg:gap-8"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px">
                  <span className="absolute inset-0 origin-left scale-x-0 bg-cyan transition-transform duration-500 group-hover:scale-x-100" />
                </span>
                <span aria-hidden="true" className="outline-number">
                  {p.number}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-title text-ink">{p.title}</h3>
                  <p className="text-body text-ink-muted">{p.body}</p>
                </div>
              </Anim>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Yang kami bangun: bento 4 kolom */}
      <section aria-labelledby="sistem" className="section-block">
        <div className="container-narrow flex flex-col gap-14">
          <Anim>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <SectionHead id="sistem" eyebrow="Yang kami bangun" title="Sistem yang tumbuh bersama bisnis Anda" />
              <p className="text-body text-ink-muted lg:w-[420px] lg:shrink-0">
                Semua modul dirancang modular, sehingga bisa disambungkan satu sama lain dan dikembangkan tanpa membongkar dari awal.
              </p>
            </div>
          </Anim>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SYSTEMS.map((s, i) => (
              <BentoTile key={s.variant} variant={s.variant} index={i}>
                <p className="text-tagline text-cyan-ink">{s.eyebrow}</p>
                <h3 className={s.variant === "hris" ? "max-w-[300px] text-[28px] leading-[36px] font-semibold text-ink" : "text-title text-ink"}>{s.title}</h3>
                <p className="text-body text-ink-muted">{s.body}</p>
                {s.chips ? (
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {s.chips.map((chip) => (
                      <li key={chip} className="rounded-[4px] border border-[#333333] px-3 py-1 text-[14px] leading-[22px] text-white">
                        {chip}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {s.variant === "hris" ? (
                  <>
                    <StarIcon className="anim-drift absolute top-9 right-10 h-14 w-14 text-cyan" />
                    <span aria-hidden="true" className="absolute right-[-24px] bottom-[-24px] h-[210px] w-[150px] bg-[linear-gradient(135deg,#30c2db,#43f4fa)] opacity-90 [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
                    <span aria-hidden="true" className="absolute right-[140px] bottom-[-60px] h-[170px] w-[110px] bg-[linear-gradient(135deg,#30c2db,#43f4fa)] opacity-50 [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
                  </>
                ) : null}
                {s.variant === "dms" ? (
                  <div aria-hidden="true" className="mt-auto flex flex-col">
                    <div className="relative flex items-center justify-between px-1">
                      <span className="absolute inset-x-3 top-1/2 h-0.5 bg-[#080808]/35" />
                      <span className="relative z-[1] h-3 w-3 rounded-full bg-[#080808]" />
                      <span className="relative z-[1] h-3 w-3 rounded-full bg-[#080808]" />
                      <span className="relative z-[1] h-3 w-3 rounded-full bg-[#080808]" />
                      <span className="anim-travel absolute top-1/2 left-0 z-[2] h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#080808] bg-white" />
                    </div>
                    <div className="mt-2 flex justify-between text-[13px] leading-[20px] font-medium text-[#080808]">
                      <span>Ajukan</span>
                      <span>Setujui</span>
                      <span>Arsipkan</span>
                    </div>
                  </div>
                ) : null}
              </BentoTile>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Cara kerja: stepper interaktif di atas latar gelap */}
      <section data-theme="dark" aria-labelledby="proses" className="section-block relative overflow-hidden bg-ground">
        <DotField />
        <div className="container-narrow relative flex flex-col gap-12">
          <Anim>
            <SectionHead
              id="proses"
              eyebrow="Cara kerja"
              title="Empat tahap, satu blueprint yang disepakati bersama"
              intro="Setiap modul dikerjakan, diuji, dan didemokan sebelum lanjut ke modul berikutnya."
            />
          </Anim>
          <ProcessStepper />
          <div className="flex flex-col gap-6 border-t border-line pt-12">
            <h3 className="text-heading text-ink">Pilih model kerja sama yang paling pas</h3>
            <ModelSwitch />
          </div>
        </div>
      </section>

      {/* 5. Studi kasus */}
      {featured.length > 0 ? (
        <section aria-labelledby="studi-kasus" className="section-block">
          <div className="container-narrow flex flex-col gap-10">
            <Anim>
              <SectionHead id="studi-kasus" eyebrow="Studi kasus" title="Hasil yang bisa diukur, bukan sekadar aplikasi baru" />
            </Anim>
            <CaseTabs items={featured.slice(0, 2)} />
          </div>
        </section>
      ) : null}

      {/* 6. Band website (untuk usaha & personal) */}
      <BandCta
        id="usaha"
        eyebrow="Untuk usaha & personal"
        title="Butuh website untuk usaha Anda?"
        body={`Company profile, landing page, dan toko online${webPrice}, termasuk domain .com satu tahun dan maintenance.`}
      >
        {activePromos.length > 0 ? (
          <Link href="/promo" className="inline-flex min-h-12 items-center font-medium underline underline-offset-4">
            Lihat promo aktif
          </Link>
        ) : null}
        <Link
          href="/layanan#web-development"
          className="inline-flex min-h-12 items-center rounded-md bg-[#080808] px-6 font-medium text-white transition-colors hover:bg-[#181818]"
        >
          Lihat Paket Website
        </Link>
      </BandCta>

      {/* 7. Testimoni (conditional) */}
      {showTestimonials ? (
        <section aria-labelledby="testimoni" className="section-block">
          <div className="container-narrow flex flex-col gap-10">
            <Anim>
              <SectionHead id="testimoni" eyebrow="Kata klien" title="Yang dirasakan tim setelah sistemnya berjalan" />
            </Anim>
            <TestimonialCarousel items={testimonials.slice(0, 3)} />
          </div>
        </section>
      ) : null}

      {/* 8. Kecocokan */}
      <section aria-labelledby="kecocokan" className="section-block">
        <div className="container-narrow flex flex-col gap-10">
          <Anim>
            <SectionHead id="kecocokan" eyebrow="Kecocokan" title="Apakah kami partner yang tepat untuk Anda?" />
          </Anim>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6 rounded-lg bg-[#080808] p-6 [--ink:#ffffff] [--ink-muted:#a3a3a3] lg:p-8">
              <h3 className="text-title text-ink">Cocok untuk</h3>
              <ul className="flex flex-col gap-4">
                {FIT_YES.map((t) => (
                  <li key={t} className="flex gap-4">
                    <span className="text-cyan">
                      <CheckIcon />
                    </span>
                    <span className="text-body text-ink">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-6 lg:p-8">
              <h3 className="text-title text-ink">Kurang cocok untuk</h3>
              <ul className="flex flex-col gap-4">
                {FIT_NO.map((t) => (
                  <li key={t} className="flex gap-4">
                    <span className="text-ink-muted">
                      <CrossIcon />
                    </span>
                    <span className="text-body text-ink">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA penutup */}
      <ClosingCta whatsappHref={siteWhatsappUrl(site)} />
    </>
  );
}
