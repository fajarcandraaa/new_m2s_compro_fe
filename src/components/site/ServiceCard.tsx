import Link from "next/link";
import type { Service } from "@/lib/api/types";

/** Service card (mockup Layanan `.svc`): garis atas tumbuh saat hover, model kerja di kaki kartu. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-8 transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-cyan">
      <span aria-hidden="true" className="absolute top-[-1px] left-8 h-[3px] w-12 bg-cyan transition-[width] duration-[400ms] group-hover:w-[calc(100%-64px)]" />
      {service.eyebrow ? (
        <p className="self-start rounded-[4px] border border-line px-2.5 py-0.5 text-[13px] leading-[22px] font-medium tracking-[0.06em] text-cyan-ink uppercase">
          {service.eyebrow}
        </p>
      ) : null}
      <h3 className="text-title text-ink">{service.title}</h3>
      <p className="text-small text-ink-muted">{service.summary}</p>
      {service.points.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {service.points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-small text-ink">
              <span aria-hidden="true" className="mt-[9px] h-2 w-2 shrink-0 bg-cyan [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
              {p}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-col gap-4 border-t border-dashed border-line pt-4">
        {service.priceValue ? (
          <p className="text-small text-ink">
            {service.priceLabel ? <span className="text-ink-muted">{service.priceLabel}: </span> : null}
            {service.priceValue}
          </p>
        ) : null}
        <Link href={`/layanan/${service.slug}`} className="text-small font-medium text-cyan-ink after:absolute after:inset-0 after:content-['']">
          Lihat detail<span aria-hidden="true"> &rarr;</span>
          <span className="sr-only">: {service.title}</span>
        </Link>
      </div>
    </article>
  );
}
