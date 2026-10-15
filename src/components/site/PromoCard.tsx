import type { Promo } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPromoPeriod } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Promo Card (Figma): status computed by the API from the period; ended promos are dimmed. */
export function PromoCard({ promo }: { promo: Promo }) {
  const ended = promo.status === "ended";
  return (
    <Card as="article" className={cn("flex h-full flex-col gap-4 p-8", ended && "opacity-50")}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-tagline text-cyan-ink">{promo.service?.title ?? "Promo"}</p>
        <StatusBadge status={promo.status} />
      </div>
      <h3 className="text-heading text-ink">{promo.title}</h3>
      <p className="text-small text-ink-muted">{promo.description}</p>
      <p className="text-[14px] leading-[22px] font-medium text-ink">{formatPromoPeriod(promo.startsAt, promo.endsAt)}</p>
      {promo.code ? (
        <p className="inline-flex w-fit gap-2 rounded-sm bg-ground px-4 py-2 text-[14px] leading-[22px]">
          <span className="text-ink-muted">Kode</span>
          <span className="font-medium text-ink">{promo.code}</span>
        </p>
      ) : null}
    </Card>
  );
}
