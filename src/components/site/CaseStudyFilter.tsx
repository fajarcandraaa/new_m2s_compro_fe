"use client";

import { useMemo, useState } from "react";
import { CaseTabs } from "@/components/site/CaseTabs";
import { FilterButton } from "@/components/ui/Filter";
import type { CaseStudySummary } from "@/lib/api/types";

/**
 * Filter kategori + panel studi kasus (mockup `.chips` + `.cpanel`).
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

      <div aria-live="polite">
        <CaseTabs key={active ?? "all"} items={shown} showAllLink={false} />
      </div>
    </div>
  );
}
