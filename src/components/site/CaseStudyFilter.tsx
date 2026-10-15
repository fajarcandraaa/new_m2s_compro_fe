"use client";

import { useMemo, useState } from "react";
import { CaseStudyCard } from "@/components/site/CaseStudyCard";
import { FilterButton } from "@/components/ui/Filter";
import type { CaseStudySummary } from "@/lib/api/types";

/** Client-side category filter (brief §5: /studi-kasus). */
export function CaseStudyFilter({ items }: { items: CaseStudySummary[] }) {
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? items.filter((i) => i.category === active) : items;

  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      {categories.length > 1 ? (
        <div role="group" aria-label="Filter kategori" className="flex flex-wrap gap-2">
          <FilterButton selected={active === null} onClick={() => setActive(null)}>
            Semua
          </FilterButton>
          {categories.map((c) => (
            <FilterButton key={c} selected={active === c} onClick={() => setActive(c)}>
              {c}
            </FilterButton>
          ))}
        </div>
      ) : null}
      {shown.length > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2" aria-live="polite">
          {shown.map((cs) => (
            <li key={cs.slug}>
              <CaseStudyCard cs={cs} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body text-ink-muted">Belum ada studi kasus yang dipublikasikan.</p>
      )}
    </div>
  );
}
