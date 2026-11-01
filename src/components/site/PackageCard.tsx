import type { ServicePackage } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Paket web (mockup Layanan `.pkg`): paket unggulan tampil gelap dengan badge "Mulai dari sini". */
export function PackageCard({ pkg, serviceSlug }: { pkg: ServicePackage; serviceSlug: string }) {
  const href = `/diskusi?layanan=${encodeURIComponent(serviceSlug)}&paket=${encodeURIComponent(pkg.name)}`;
  const hot = pkg.highlighted;
  const fromLabel = pkg.priceLabel || (hot ? "Mulai dari" : "Harga");
  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-4 rounded-2xl border px-6 py-8 transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-cyan",
        hot
          ? "border-[#080808] bg-[#080808] [--cyan-ink:#30c2db] [--ink:#ffffff] [--ink-muted:#a3a3a3] [--line:#333333]"
          : "border-line bg-surface",
      )}
    >
      {hot ? (
        <span className="absolute top-[-14px] right-4 rounded-[4px] bg-cyan px-3 text-[13px] leading-6 font-semibold text-on-cyan">
          Mulai dari sini
        </span>
      ) : null}
      <h3 className="text-title text-ink">{pkg.name}</h3>
      <div>
        <p className="text-small leading-5 text-ink-muted">{fromLabel}</p>
        <p className="text-[28px] leading-[36px] font-semibold text-ink">{pkg.priceValue}</p>
      </div>
      {pkg.description ? <p className="text-small text-ink-muted">{pkg.description}</p> : null}
      {pkg.features.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {pkg.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-small text-ink">
              <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 bg-cyan [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
              {f}
            </li>
          ))}
        </ul>
      ) : null}
      <Button href={href} variant={hot ? "primary" : "secondary"} className="mt-auto w-full whitespace-normal text-center">
        Pilih Paket {pkg.name}
      </Button>
    </article>
  );
}
