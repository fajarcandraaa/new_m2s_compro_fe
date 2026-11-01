"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { CaseStudySummary } from "@/lib/api/types";

/**
 * Pemilih studi kasus (mockup `.ctab` + `.cpanel`).
 * Metadata industri/jumlah karyawan/durasi sengaja tidak dirender: belum ada
 * sumber datanya di CMS. Tata letak disusun supaya panel tetap rapat.
 */
export function CaseTabs({ items, showAllLink = true }: { items: CaseStudySummary[]; showAllLink?: boolean }) {
  const [active, setActive] = useState(0);
  const cs = items[active] ?? items[0];
  if (!cs) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[4fr_8fr] lg:gap-12">
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              "flex flex-col gap-1 rounded-lg border p-5 text-left transition-[border-color,background-color,transform] duration-250",
              i === active
                ? "border-cyan bg-surface"
                : "border-line bg-transparent hover:translate-x-1 hover:border-cyan",
            )}
          >
            <span className="text-tagline text-cyan-ink">
              {item.systemName} · {item.category}
            </span>
            <span className="text-[18px] leading-[26px] font-semibold text-ink">{item.title}</span>
          </button>
        ))}
        {showAllLink ? (
          <Link href="/studi-kasus" className="mt-4 inline-flex min-h-12 items-center self-start rounded-md border border-line px-6 text-body font-medium text-ink transition-colors hover:border-cyan">
            Lihat Semua Studi Kasus
          </Link>
        ) : null}
      </div>

      <div key={cs.slug} className="anim-fadein flex flex-col gap-7 rounded-lg border border-line bg-surface p-6 lg:p-10">
        <div className="flex flex-col gap-3">
          <p className="text-tagline text-cyan-ink">
            {cs.systemName} · {cs.category}
          </p>
          <h3 className="text-heading text-ink">{cs.title}</h3>
          <p className="text-body text-ink-muted">{cs.summary || cs.cardBody}</p>
        </div>

        {cs.metrics.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {cs.metrics.slice(0, 2).map((m) => (
              <div key={m.label} className="flex flex-col gap-2 border-t-[3px] border-cyan pt-4">
                <p className="text-[64px] leading-[64px] font-semibold text-ink lg:text-[80px] lg:leading-[80px]">{m.value}</p>
                <p className="text-body text-ink">{m.label}</p>
              </div>
            ))}
          </div>
        ) : null}

        <Link href={`/studi-kasus/${cs.slug}`} className="mt-auto inline-flex items-center gap-1 font-medium text-cyan-ink hover:underline">
          Baca studi kasus <span aria-hidden="true">→</span>
          <span className="sr-only">: {cs.title}</span>
        </Link>
      </div>
    </div>
  );
}
