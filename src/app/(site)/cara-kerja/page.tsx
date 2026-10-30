import type { Metadata } from "next";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { Step } from "@/components/site/Step";
import { Button } from "@/components/ui/Button";
import { InfoCard } from "@/components/ui/Card";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Proses Kerja Kami",
  description:
    "Sebagian besar sistem internal tidak gagal karena teknologinya. Mereka gagal karena bisnis membangun sistem yang salah terlalu cepat.",
  path: "/cara-kerja",
});

const AGAINST = [
  "Pengembangan berbasis fitur tanpa pemetaan kebutuhan yang matang",
  "Melewatkan fase discovery demi kecepatan semu",
  "Sistem yang tidak dirancang untuk berubah",
  "Vendor yang selesai di delivery, lalu menghilang",
];

const PRINCIPLES = [
  { eyebrow: "01", title: "Kami mulai dari kejelasan, bukan kode", body: "Membangun sistem tanpa kejelasan hanya mempercepat kegagalan." },
  {
    eyebrow: "02",
    title: "Kami merancang untuk perubahan",
    body: "Sistem yang baik bukan yang paling lengkap, tetapi yang tetap stabil saat kebutuhan berubah.",
  },
  {
    eyebrow: "03",
    title: 'Kami lebih sering berkata "tidak"',
    body: "Menolak keputusan buruk di awal jauh lebih murah daripada memperbaikinya di akhir.",
  },
  {
    eyebrow: "04",
    title: "Kami berpikir sebagai partner",
    body: "Tugas Kami bukan sekadar mengerjakan, tetapi menjaga sistem bisnis Anda tetap masuk akal.",
  },
];

const STAGES = [
  {
    number: "01",
    title: "Discovery & Alignment",
    body: "Workshop dengan stakeholder untuk memahami tujuan bisnis, pain point, dan proses yang berjalan. Output: dokumen kebutuhan dan blueprint sistem.",
  },
  {
    number: "02",
    title: "System Blueprint",
    body: "Arsitektur sistem, skema database, mockup UI/UX, dan dokumentasi teknis didiskusikan dan disetujui sebelum development.",
  },
  {
    number: "03",
    title: "Modular Implementation",
    body: "Development iteratif per modul. Setiap modul diuji dan direview sebelum lanjut, dengan demo dan umpan balik rutin.",
  },
  {
    number: "04",
    title: "Stabilization & Growth",
    body: "Monitoring setelah go-live, pelatihan tim internal, knowledge transfer, dan dukungan pengembangan berkelanjutan.",
  },
];

const IMPACT = [
  { eyebrow: "Waktu", title: "Proses operasional lebih efisien", body: "Tim berhenti mengerjakan ulang hal yang sama dan menunggu rekap manual." },
  { eyebrow: "Kontrol", title: "Data rapi, perubahan terkelola", body: "Setiap perubahan terdokumentasi dan bisa ditelusuri." },
  { eyebrow: "Stabilitas", title: "Tumbuh tanpa dibangun ulang", body: "Modul baru ditambahkan tanpa membongkar yang sudah berjalan." },
];

export default function CaraKerjaPage() {
  return (
    <>
      <PageHero
        eyebrow="Cara kerja"
        title="Proses Kerja Kami"
        lead="Sebagian besar sistem internal tidak gagal karena teknologinya. Mereka gagal karena bisnis membangun sistem yang salah terlalu cepat."
      />

      <section aria-labelledby="lawan" className="container-site py-16 lg:py-24">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <div className="flex flex-col gap-4 lg:w-[520px] lg:shrink-0">
            <p className="text-tagline text-cyan-ink">Yang Kami lawan</p>
            <h2 id="lawan" className="text-heading text-ink">
              Bukan kompetitor, tapi pola kerja yang keliru
            </h2>
            <p className="text-body text-ink-muted">
              Pola ini hampir selalu berakhir sama: waktu terbuang, biaya membengkak, dan sistem akhirnya ditinggalkan.
            </p>
          </div>
          <ul className="flex-1">
            {AGAINST.map((t) => (
              <li key={t} className="flex gap-4 border-t border-line py-5">
                <span className="w-14 shrink-0 pt-1 text-[14px] leading-[22px] font-medium text-ink-muted">Tidak</span>
                <span className="text-title text-ink">{t}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-labelledby="prinsip" className="container-site pb-16 lg:pb-24">
        <Reveal className="flex flex-col gap-8 lg:gap-12">
          <SectionHead id="prinsip" eyebrow="Prinsip" title="Cara Kami berpikir" />
          <div className="grid items-start gap-4 md:grid-cols-2 md:gap-6">
            {PRINCIPLES.map((p) => (
              <InfoCard key={p.eyebrow} {...p} />
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="tahapan" className="container-site pb-16 lg:pb-24">
        <Reveal className="flex flex-col gap-8 lg:gap-12">
          <SectionHead id="tahapan" eyebrow="Tahapan" title="Empat tahap dari discovery sampai bertumbuh" />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s) => (
              <li key={s.number}>
                <Step {...s} />
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section aria-labelledby="dampak" className="container-site pb-16 lg:pb-24">
        <Reveal className="flex flex-col gap-8 lg:gap-12">
          <SectionHead id="dampak" eyebrow="Kenapa penting" title="Pendekatan ini berdampak langsung pada tiga hal" />
          <div className="grid items-start gap-4 md:grid-cols-3 md:gap-6">
            {IMPACT.map((p) => (
              <InfoCard key={p.eyebrow} {...p} />
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-label="Ajakan diskusi" className="container-site pb-16 lg:pb-24">
        <Reveal>
          <div className="flex flex-col items-start gap-4 rounded-lg border-2 border-cyan bg-surface p-6 lg:p-12">
            <p className="max-w-[900px] text-heading text-ink">
              Jika Anda mencari pengembangan yang cepat dan murah, Kami kemungkinan bukan pilihan yang tepat. Jika Anda mencari
              partner untuk sistem yang stabil dan siap bertumbuh, mari berdiskusi.
            </p>
            <Button href="/diskusi">Diskusi Kebutuhan Sistem</Button>
          </div>
        </Reveal>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Cara Kerja", path: "/cara-kerja" }])} />
    </>
  );
}
