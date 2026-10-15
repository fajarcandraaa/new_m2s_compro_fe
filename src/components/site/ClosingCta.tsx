import { BrandScreen } from "@/components/brand/BrandScreen";
import { DotField } from "@/components/brand/DotField";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/Button";

/** Closing CTA (dark): "Ceritakan proses yang ingin Anda rapikan" + 2 buttons. */
export function ClosingCta({
  whatsappHref,
  eyebrow = "Mulai dari discovery",
  title = "Ceritakan proses yang ingin Anda rapikan",
  body = "Sesi diskusi awal tanpa biaya. Kami bantu petakan masalah dan langkah berikutnya, bahkan jika akhirnya Anda tidak bekerja dengan Kami.",
}: {
  whatsappHref: string;
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section data-theme="dark" aria-labelledby="cta-penutup" className="relative overflow-hidden bg-ground">
      <DotField />
      <div aria-hidden="true" className="absolute inset-0 mx-auto hidden max-w-[1440px] lg:block">
        <BrandScreen className="absolute top-[120px] right-[200px] h-[598px] w-[230px]" />
        <BrandScreen className="absolute top-10 right-[-100px] h-[728px] w-[280px]" />
      </div>
      <div className="relative container-site py-16 lg:py-28">
        <Reveal className="flex max-w-[640px] flex-col gap-6">
          <p className="text-tagline text-cyan-ink">{eyebrow}</p>
          <h2 id="cta-penutup" className="text-display-responsive text-ink">
            {title}
          </h2>
          <p className="max-w-[560px] text-body text-ink-muted">{body}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button href="/diskusi">Diskusi Kebutuhan Sistem</Button>
            <Button href={whatsappHref} variant="secondary">
              Chat via WhatsApp
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
