import Link from "next/link";
import type { Service } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";

/** Service Card (Figma): all texts and price from CMS > Layanan. The whole card is one link. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card as="article" className="group relative flex h-full flex-col gap-6 p-8 transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-cyan">
      <span aria-hidden="true" className="absolute top-[-1px] left-8 h-[3px] w-12 bg-cyan transition-[width] duration-[400ms] group-hover:w-[calc(100%-64px)]" />
      <div className="flex flex-col gap-2">
        {service.eyebrow ? <p className="text-tagline text-cyan-ink">{service.eyebrow}</p> : null}
        <h3 className="text-title text-ink">{service.title}</h3>
        <p className="text-small text-ink-muted">{service.summary}</p>
      </div>
      {service.points.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {service.points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-small text-ink">
              <span aria-hidden="true" className="h-[2px] w-3 shrink-0 bg-cyan" />
              {p}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-col gap-4 border-t border-line pt-6">
        {service.priceLabel ? <p className="text-small text-ink-muted">{service.priceLabel}</p> : null}
        {service.priceValue ? <p className="text-title text-ink">{service.priceValue}</p> : null}
        <Link href={`/layanan/${service.slug}`} className="font-medium text-cyan-ink after:absolute after:inset-0 after:content-['']">
          Lihat detail layanan<span className="sr-only">: {service.title}</span>
        </Link>
      </div>
    </Card>
  );
}
