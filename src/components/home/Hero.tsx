import { HeroVisual } from "@/components/brand/HeroVisual";
import { WaveField } from "@/components/brand/WaveField";
import { ClientLogo } from "@/components/site/ClientLogo";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/Button";
import type { ClientLogo as Logo } from "@/lib/api/types";

/** Homepage hero (Figma 29:1506 / mobile 35:1506). */
export function Hero({ logos }: { logos: Logo[] }) {
  return (
    <section data-theme="dark" aria-labelledby="hero-title" className="relative overflow-hidden bg-ground">
      <WaveField />
      <div className="relative mx-auto max-w-[1440px] px-4 pt-8 pb-12 lg:min-h-[769px] lg:px-24 lg:pt-[139px] lg:pb-14">
        <HeroVisual className="mx-auto w-full max-w-[320px] sm:max-w-[400px] lg:absolute lg:top-[59px] lg:right-10 lg:mx-0 lg:w-[min(640px,calc(50vw-40px))] lg:max-w-none" />
        <div className="relative mt-8 flex flex-col gap-6 lg:mt-0 lg:max-w-[min(600px,calc(50vw-96px))]">
          <Reveal>
            <p className="text-tagline text-cyan-ink">Partner Sistem Internal B2B</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 id="hero-title" className="text-display-hero text-ink">
              Sistem internal yang tumbuh bersama bisnis Anda
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-[540px] text-body text-ink-muted">
              Kami membangun HRIS, DMS, dan portal internal yang modular dan terdokumentasi. Kami mulai dari memahami cara kerja tim
              Anda, bukan langsung menulis kode.
            </p>
          </Reveal>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Reveal delay={0.3}>
              <Button href="/diskusi" className="w-full sm:w-auto">
                Diskusi Kebutuhan Sistem
              </Button>
            </Reveal>
            <Reveal delay={0.4}>
              <Button href="/studi-kasus" variant="secondary" className="w-full sm:w-auto">
                Lihat Studi Kasus
              </Button>
            </Reveal>
          </div>
        </div>
        {logos.length > 0 ? (
          <div className="relative mt-12 flex flex-col gap-4 lg:mt-[68px] lg:flex-row lg:items-center lg:gap-6">
            <p className="text-small whitespace-nowrap text-ink-muted">Dipercaya tim di</p>
            <ul className="flex flex-wrap gap-4 lg:gap-6">
              {logos.slice(0, 5).map((l) => (
                <li key={l.id}>
                  <ClientLogo logo={l} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
