import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/*
 * Token di-override per varian supaya utility anak (text-ink, text-ink-muted,
 * text-cyan-ink) otomatis ikut warna tile, tanpa prop warna terpisah.
 */
const VARIANTS = {
  hris: "col-span-1 lg:col-span-2 lg:row-span-2 lg:min-h-[420px] border-transparent bg-[#080808] [--ink:#ffffff] [--ink-muted:#a3a3a3] [--cyan-ink:#30c2db]",
  dms: "col-span-1 lg:col-span-2 border-transparent bg-[linear-gradient(135deg,#30c2db,#43f4fa)] [--ink:#080808] [--ink-muted:#080808] [--cyan-ink:#080808]",
  portal: "bg-surface",
  custom: "border-dashed bg-surface",
} as const;

/** Tile bento "Yang kami bangun" (mockup `.tile`): naik 6px dan border cyan saat hover. */
export function BentoTile({
  variant = "portal",
  index = 0,
  className,
  children,
}: {
  variant?: keyof typeof VARIANTS;
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "anim-pop relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line p-6 transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-cyan lg:p-8",
        VARIANTS[variant],
        className,
      )}
      style={{ "--i": index } as CSSProperties}
    >
      {children}
    </article>
  );
}
