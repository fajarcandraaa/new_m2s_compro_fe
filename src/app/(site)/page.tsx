import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { CaseStudyCard } from "@/components/site/CaseStudyCard";
import { ClosingCta } from "@/components/site/ClosingCta";
import { ModelPanels, STEPS } from "@/components/site/process";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { Step } from "@/components/site/Step";
import { Button } from "@/components/ui/Button";
import { Card, InfoCard } from "@/components/ui/Card";
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

const PROBLEMS = [
  {
    eyebrow: "01",
    title: "Kebutuhan tidak jelas",
    body: "Requirement berubah-ubah, fitur dibuat tapi tidak dipakai, dan sistem akhirnya tidak cocok dengan cara kerja tim.",
  },
  {
    eyebrow: "02",
    title: "Perubahan kecil merusak sistem",
    body: "Tanpa dokumentasi dan struktur yang rapi, setiap update terasa berisiko sehingga tim takut mengubah apa pun.",
  },
  {
    eyebrow: "03",
    title: "Sistem tidak ikut tumbuh",
    body: "Bisnis berkembang, tapi sistem tidak bisa mengikuti. Vendor sulit dihubungi dan biaya perawatan membengkak.",
  },
];

const SYSTEMS = [
  {
    eyebrow: "HRIS",
    title: "HRIS & Employee Management",
    body: "Absensi, cuti, payroll, penilaian kinerja, dan layanan mandiri karyawan dalam satu sistem.",
  },
  {
    eyebrow: "DMS",
    title: "Document Management & Approval",
    body: "Alur persetujuan yang bisa dikonfigurasi, arsip dokumen, dan jejak audit untuk setiap keputusan.",
  },
  {
    eyebrow: "PORTAL",
    title: "Internal Portal & Reporting",
    body: "Dashboard KPI dan laporan yang diperbarui otomatis untuk manajemen dan tiap divisi.",
  },
  {
    eyebrow: "CUSTOM",
    title: "Sistem Operasional Custom",
    body: "Sistem yang mengikuti proses unik perusahaan Anda, dari gudang sampai layanan lapangan.",
  },
];

const FIT_YES = [
  "Pemilik bisnis yang lelah dengan proses manual dan sistem yang terpisah-pisah",
  "Perusahaan dengan proses bisnis yang kompleks",
  "Tim yang pernah gagal mengimplementasikan sistem internal",
  "Organisasi yang mencari partner jangka panjang",
];
const FIT_NO = [
  "Proyek yang hanya mengejar harga termurah dan hasil instan",
  "Proyek tanpa komitmen untuk fase discovery",
  "Permintaan perbaikan cepat tanpa mau membenahi proses",
];

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

      {/* 2. Masalah */}
      <section aria-labelledby="masalah" className="container-site pt-16 pb-16 lg:pt-28 lg:pb-28">
        <Reveal className="flex flex-col gap-8 lg:gap-14">
          <SectionHead
            id="masalah"
            eyebrow="Masalah"
            title="Sebagian besar sistem internal gagal sebelum baris kode pertama ditulis"
            intro="Akar masalahnya jarang di teknologi. Biasanya kebutuhan tidak dipetakan dengan jelas dan struktur sistemnya tidak dirancang untuk berubah."
          />
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {PROBLEMS.map((p) => (
              <InfoCard key={p.eyebrow} {...p} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 3. Sistem yang Kami bangun */}
      <section aria-labelledby="sistem" className="container-site pb-16 lg:pt-28 lg:pb-28">
        <Reveal className="flex flex-col gap-8 lg:gap-14">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <SectionHead id="sistem" eyebrow="Yang Kami bangun" title="Sistem yang Kami bangun" />
            <p className="text-body text-ink-muted lg:w-[460px] lg:shrink-0">
              Semua modul dirancang modular, sehingga bisa disambungkan satu sama lain dan dikembangkan tanpa membongkar dari awal.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {SYSTEMS.map((s) => (
              <InfoCard key={s.eyebrow} {...s} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 4. Proses */}
      <section aria-labelledby="proses" className="container-site pb-16 lg:pt-28 lg:pb-28">
        <Reveal className="flex flex-col gap-8 lg:gap-14">
          <SectionHead
            id="proses"
            eyebrow="Cara kerja"
            title="Empat tahap, satu blueprint yang disepakati bersama"
            intro="Setiap modul dikerjakan, diuji, dan didemokan sebelum lanjut ke modul berikutnya."
            introClassName="hidden lg:block"
          />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.number}>
                <Step {...s} />
              </li>
            ))}
          </ol>
          <div className="hidden md:block">
            <ModelPanels />
          </div>
        </Reveal>
      </section>

      {/* 5. Studi kasus */}
      {featured.length > 0 ? (
        <section aria-labelledby="studi-kasus" className="container-site pb-16 lg:pb-28">
          <Reveal className="flex flex-col gap-8 lg:gap-14">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <SectionHead id="studi-kasus" eyebrow="Studi kasus" title="Hasil yang bisa diukur, bukan sekadar aplikasi baru" />
              <div className="hidden shrink-0 lg:block">
                <Button href="/studi-kasus" variant="secondary">
                  Lihat Semua Studi Kasus
                </Button>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              {featured.slice(0, 2).map((cs) => (
                <CaseStudyCard key={cs.slug} cs={cs} />
              ))}
            </div>
            <Button href="/studi-kasus" variant="secondary" className="w-full lg:hidden">
              Lihat Semua Studi Kasus
            </Button>
          </Reveal>
        </section>
      ) : null}

      {/* 6. Testimoni (conditional) */}
      {showTestimonials ? (
        <section aria-labelledby="testimoni" className="container-site pb-16 lg:pb-28">
          <Reveal className="flex flex-col gap-8 lg:gap-14">
            <SectionHead id="testimoni" eyebrow="Kata klien" title="Yang dirasakan tim setelah sistemnya berjalan" />
            <TestimonialCarousel items={testimonials.slice(0, 3)} />
          </Reveal>
        </section>
      ) : null}

      {/* 7. Strip B2C */}
      <section aria-labelledby="usaha" className="container-site pb-16 lg:pb-28">
        <Reveal>
          <Card className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-12 lg:py-10">
            <div className="flex flex-col gap-2 lg:max-w-[620px]">
              <p className="text-tagline text-cyan-ink">Untuk usaha &amp; personal</p>
              <h2 id="usaha" className="text-heading text-ink">
                Butuh website untuk usaha Anda?
              </h2>
              <p className="text-body text-ink-muted">
                Company profile, landing page, dan toko online{webPrice}, termasuk domain .com satu tahun dan maintenance.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
              {activePromos.length > 0 ? (
                <a href="/promo" className="font-medium text-cyan-ink hover:underline">
                  Lihat promo aktif
                </a>
              ) : null}
              <Button href="/layanan#web-development" variant="secondary" className="w-full lg:w-auto">
                Lihat Paket Website
              </Button>
            </div>
          </Card>
        </Reveal>
      </section>

      {/* 8. Kecocokan */}
      <section aria-labelledby="kecocokan" className="container-site pb-16 lg:pb-28">
        <Reveal className="flex flex-col gap-8 lg:gap-14">
          <SectionHead id="kecocokan" eyebrow="Kecocokan" title="Apakah Kami partner yang tepat untuk Anda?" />
          <div className="grid items-start gap-8 md:grid-cols-2 md:gap-6">
            <div className="flex flex-col gap-4 rounded-lg border-2 border-cyan bg-surface p-6 lg:p-8">
              <h3 className="text-title text-ink">Cocok untuk</h3>
              <ul className="flex flex-col gap-4">
                {FIT_YES.map((t) => (
                  <li key={t} className="flex gap-4">
                    <span className="w-11 shrink-0 text-[14px] leading-[22px] font-medium text-cyan-ink lg:w-12">Ya</span>
                    <span className="text-body text-ink">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="flex flex-col gap-4 p-6 lg:p-8">
              <h3 className="text-title text-ink">Kurang cocok untuk</h3>
              <ul className="flex flex-col gap-4">
                {FIT_NO.map((t) => (
                  <li key={t} className="flex gap-4">
                    <span className="w-11 shrink-0 text-[14px] leading-[22px] font-medium text-ink-muted lg:w-12">Tidak</span>
                    <span className="text-body text-ink">{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Reveal>
      </section>

      {/* 9. CTA penutup */}
      <ClosingCta whatsappHref={siteWhatsappUrl(site)} />
    </>
  );
}
