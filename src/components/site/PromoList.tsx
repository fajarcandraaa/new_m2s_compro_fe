"use client";

import { useState } from "react";
import { PromoCard } from "@/components/site/PromoCard";
import { Button } from "@/components/ui/Button";
import { FilterButton } from "@/components/ui/Filter";
import type { Promo } from "@/lib/api/types";

type F = "all" | "active" | "upcoming";

/**
 * Promo filter (Semua / Aktif / Akan datang) + empty state (Figma 51:16280).
 * Status comes from the API (computed from the period). "Semua" also contains promos that
 * ended within the last 7 days, which the API returns and the card renders dimmed.
 */
export function PromoList({ promos }: { promos: Promo[] }) {
  const [f, setF] = useState<F>("all");
  const shown = f === "all" ? promos : promos.filter((p) => p.status === f);
  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <div role="group" aria-label="Filter status promo" className="flex flex-wrap gap-2">
        <FilterButton selected={f === "all"} onClick={() => setF("all")}>
          Semua
        </FilterButton>
        <FilterButton selected={f === "active"} onClick={() => setF("active")}>
          Aktif
        </FilterButton>
        <FilterButton selected={f === "upcoming"} onClick={() => setF("upcoming")}>
          Akan datang
        </FilterButton>
      </div>
      {shown.length > 0 ? (
        <ul className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {shown.map((p) => (
            <li key={p.id}>
              <PromoCard promo={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-line bg-surface px-6 py-12 text-center lg:py-16">
          <h2 className="text-title text-ink">Belum ada promo saat ini</h2>
          <p className="max-w-[520px] text-body text-ink-muted">
            Promo berikutnya akan tampil di sini. Sementara itu, Anda tetap bisa berdiskusi tentang kebutuhan Anda atau melihat paket
            website.
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-4">
            <Button href="/diskusi">Diskusi Kebutuhan Sistem</Button>
            <Button href="/layanan#web-development" variant="secondary">
              Lihat Paket Website
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
