import type { Metadata } from "next";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { Step } from "@/components/site/Step";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { Card, InfoCard } from "@/components/ui/Card";
import { getSite } from "@/lib/api/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { siteWhatsappUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Tentang Kami",
  description: "Mengubah ide menjadi sistem yang menyelesaikan masalah bisnis nyata. Mindtoscreen Technology Indonesia, berdiri di Malang sejak Januari 2024.",
  path: "/tentang",
});

const VALUES = [
  { eyebrow: "01", title: "Ownership", body: "Kami memperlakukan sistem klien seperti milik sendiri." },
  { eyebrow: "02", title: "Kejujuran", body: 'Kami bilang "tidak" saat sebuah keputusan akan merugikan Anda.' },
  { eyebrow: "03", title: "Kualitas engineering", body: "Kode yang bersih dan terdokumentasi, aman untuk jangka panjang." },
  { eyebrow: "04", title: "Problem solving", body: "Kami mulai dari masalah, bukan dari daftar fitur." },
  { eyebrow: "05", title: "Kecepatan yang terukur", body: "Bergerak cepat tanpa melewatkan fase yang penting." },
];

const JOURNEY = [
  { number: "Januari 2024", title: "Mindtoscreen berdiri", body: "Didirikan di Malang, Jawa Timur." },
  { number: "Tonggak", title: "Proyek besar pertama", body: "Bukti kemampuan menghadirkan sistem yang dapat diandalkan." },
  { number: "Tonggak", title: "Produk internal pertama", body: "Ide produk lahir dari pengalaman proyek klien." },
  { number: "Berikutnya", title: "Bertumbuh bersama klien", body: "Memperkuat kapabilitas sebagai partner sistem internal jangka panjang." },
];

export default async function TentangPage() {
  const site = await getSite();
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Mengubah ide menjadi sistem yang menyelesaikan masalah bisnis nyata"
        lead={`${site.legalName}, berdiri di Malang sejak Januari 2024.`}
      />

      <section aria-labelledby="cerita" className="container-site py-16 lg:py-24">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <div className="flex flex-col gap-4 lg:w-[480px] lg:shrink-0">
            <p className="text-tagline text-cyan-ink">Cerita Kami</p>
            <h2 id="cerita" className="text-heading text-ink">
              Berawal dari keyakinan bahwa teknologi seharusnya menghadirkan kepastian
            </h2>
          </div>
          <div className="flex flex-1 flex-col gap-4 text-body text-ink-muted">
            <p>
              Setelah bertahun-tahun di industri perangkat lunak dan melihat langsung tingginya ketidakpastian di ekosistem teknologi
              Indonesia, pendiri Kami memilih jalan yang berbeda.
            </p>
            <p>
              Yang dimulai sebagai perjalanan freelance perlahan menjadi tempat bagi para profesional untuk bertumbuh, berkolaborasi,
              dan membangun sistem yang benar-benar dipakai.
            </p>
            <p>Nama Kami mencerminkan misinya: Mind to Screen, mengubah ide dan kebutuhan bisnis menjadi sistem digital yang nyata.</p>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="nilai" className="container-site pb-16 lg:pb-24">
        <Reveal className="flex flex-col gap-8 lg:gap-12">
          <SectionHead id="nilai" eyebrow="Nilai" title="Lima nilai yang Kami pegang" />
          <div className="grid items-start gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {VALUES.map((v) => (
              <InfoCard key={v.eyebrow} {...v} />
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="perjalanan" className="container-site pb-16 lg:pb-24">
        <Reveal className="flex flex-col gap-8 lg:gap-12">
          <SectionHead id="perjalanan" eyebrow="Perjalanan" title="Perjalanan Kami" />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((s) => (
              <li key={s.title}>
                <Step {...s} />
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section aria-label="Kantor dan kontak" className="container-site pb-16 lg:pb-24">
        <Reveal className="grid items-start gap-4 md:grid-cols-2 md:gap-6">
          <Card className="flex flex-col gap-4 p-6 lg:p-8">
            <p className="text-tagline text-cyan-ink">Kantor</p>
            <h2 className="text-title text-ink">{site.legalName}</h2>
            {site.mapsUrl ? (
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-body text-ink-muted hover:text-cyan-ink">
                {site.address}
              </a>
            ) : (
              <p className="text-body text-ink-muted">{site.address}</p>
            )}
          </Card>
          <div className="flex flex-col gap-4 rounded-lg border-2 border-cyan bg-surface p-6 lg:p-8">
            <p className="text-tagline text-cyan-ink">Mari bekerja sama</p>
            <h2 className="text-title text-ink">Ceritakan sistem yang ingin Anda bangun</h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Button href="/diskusi">Diskusi Kebutuhan Sistem</Button>
              <WhatsAppButton href={siteWhatsappUrl(site)} source="tentang">
                Chat via WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </Reveal>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Tentang", path: "/tentang" }])} />
    </>
  );
}
