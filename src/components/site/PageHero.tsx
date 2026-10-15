import { BrandScreen } from "@/components/brand/BrandScreen";
import { DotField } from "@/components/brand/DotField";

/** Page Hero (Figma "Page Hero"): dark, dot field, two slanted screens cut off at the right. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section data-theme="dark" className="relative overflow-hidden bg-ground">
      <DotField />
      <div className="relative mx-auto max-w-[1440px]">
        <div aria-hidden="true" className="absolute inset-0 hidden md:block">
          <BrandScreen className="absolute top-[79px] right-[170px] h-[468px] w-[180px]" />
          <BrandScreen className="absolute top-[19px] right-[-70px] h-[572px] w-[220px]" />
        </div>
        <div className="relative container-site pt-12 pb-16 lg:min-h-[329px] lg:pt-[79px] lg:pb-[94px]">
          <div className="flex max-w-[760px] flex-col gap-4">
            {eyebrow ? <p className="text-tagline text-cyan-ink">{eyebrow}</p> : null}
            <h1 className="text-display-responsive text-ink">{title}</h1>
            {lead ? <p className="max-w-[620px] text-body text-ink-muted">{lead}</p> : null}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
