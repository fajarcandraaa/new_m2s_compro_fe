import type { ServicePackage } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Web Development package (Figma Layanan "paket"); highlighted package = 2px cyan border + primary button. */
export function PackageCard({ pkg, serviceSlug }: { pkg: ServicePackage; serviceSlug: string }) {
  const href = `/diskusi?layanan=${encodeURIComponent(serviceSlug)}&paket=${encodeURIComponent(pkg.name)}`;
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-lg bg-surface p-6 transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-cyan lg:p-8",
        pkg.highlighted ? "border-2 border-cyan" : "border border-line",
      )}
    >
      <div className="flex items-baseline justify-between gap-4 md:block">
        <h3 className="text-tagline text-cyan-ink">{pkg.name}</h3>
        {/* Mobile (Figma 55:1865): compact price on the name row */}
        <p className="text-small text-ink md:hidden">
          {pkg.priceLabel ? `${pkg.priceLabel.replace(/ dari$/i, "")} ` : ""}
          {pkg.priceValue}
        </p>
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {pkg.priceLabel ? <p className="text-small text-ink-muted">{pkg.priceLabel}</p> : null}
        <p className="text-title text-ink">{pkg.priceValue}</p>
      </div>
      {pkg.description ? <p className="text-small text-ink-muted">{pkg.description}</p> : null}
      {pkg.features.length > 0 ? (
        <ul className="hidden flex-col gap-2 border-t border-line pt-4 text-small text-ink md:flex">
          {pkg.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ) : null}
      <Button href={href} variant={pkg.highlighted ? "primary" : "secondary"} className="mt-auto w-full whitespace-normal text-center">
        Pilih Paket {pkg.name}
      </Button>
    </article>
  );
}
