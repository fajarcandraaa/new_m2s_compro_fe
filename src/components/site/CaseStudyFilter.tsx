"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DotField } from "@/components/brand/DotField";
import { Anim } from "@/components/site/Anim";
import { FilterButton } from "@/components/ui/Filter";
import type { CaseStudySummary } from "@/lib/api/types";

/**
 * Filter kategori + daftar kartu studi kasus (mockup `.fbtn` + `.case`).
 * Metadata industri/jumlah karyawan/durasi tidak dirender: belum ada di CMS.
 */
export function CaseStudyFilter({ items }: { items: CaseStudySummary[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [items]);

  const [active, setActive] = useState<string | null>(null);
  const shown = active ? items.filter((i) => i.category === active) : items;

  if (items.length === 0) {
    return <p className="text-body text-ink-muted">Belum ada studi kasus yang dipublikasikan.</p>;
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {categories.length > 1 ? (
        <div role="group" aria-label="Filter kategori" className="flex flex-wrap gap-2">
          <FilterButton selected={active === null} onClick={() => setActive(null)}>
            Semua ({items.length})
          </FilterButton>
          {categories.map((c) => (
            <FilterButton key={c.name} selected={active === c.name} onClick={() => setActive(c.name)}>
              {c.name} ({c.count})
            </FilterButton>
          ))}
        </div>
      ) : null}

      <div aria-live="polite" className="flex flex-col gap-6">
        {shown.map((cs, i) => (
          <Anim
            as="article"
            key={cs.slug}
            index={i}
            className="group grid overflow-hidden rounded-2xl border border-line bg-surface transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-cyan lg:grid-cols-[7fr_5fr]"
          >
            <div className="flex flex-col gap-4 p-7 lg:p-10">
              <p className="text-tagline text-cyan-ink">
                {cs.systemName} · {cs.category}
              </p>
              <h3 className="text-[28px] leading-[36px] font-semibold text-ink">{cs.title}</h3>
              <p className="text-body text-ink-muted">{cs.summary || cs.cardBody}</p>
              <Link
                href={`/studi-kasus/${cs.slug}`}
                className="mt-auto inline-flex items-center gap-2 pt-2 font-medium text-cyan-ink hover:underline"
              >
                Baca studi kasus
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                  &rarr;
                </span>
                <span className="sr-only">: {cs.title}</span>
              </Link>
            </div>

            {cs.metrics.length > 0 ? (
              <div className="relative grid grid-cols-2 gap-4 overflow-hidden bg-[#080808] p-7 [--ink:#ffffff] [--ink-muted:#a3a3a3] lg:gap-6 lg:p-10">
                <DotField />
                {cs.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="relative flex flex-col gap-2 border-t-[3px] border-cyan pt-4">
                    <p className="text-[56px] leading-[56px] font-semibold text-cyan lg:text-[72px] lg:leading-[72px]">{m.value}</p>
                    <p className="text-small text-ink">{m.label}</p>
                    {m.before ? (
                      <p className="text-small text-ink-muted">
                        <span>Sebelumnya:</span> {m.before}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </Anim>
        ))}
      </div>
    </div>
  );
}
