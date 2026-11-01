"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Anim } from "@/components/site/Anim";
import { BeforeAfter } from "@/components/site/BeforeAfter";
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
              <p className="text-body text-ink-muted">{cs.cardBody || cs.summary}</p>
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

            <div
              data-theme="dark"
              className="relative flex flex-col justify-center overflow-hidden bg-[#080808] p-7 lg:p-10"
              style={{
                backgroundImage: "radial-gradient(#181818 1.6px, transparent 1.8px)",
                backgroundSize: "32px 32px",
              }}
            >
              <BeforeAfter
                vertical
                before={cs.initialConditions}
                beforeNote={cs.initialConditionsTitle}
                after={cs.solutions}
                afterNote={cs.impactTitle}
              />
            </div>
          </Anim>
        ))}
      </div>
    </div>
  );
}
