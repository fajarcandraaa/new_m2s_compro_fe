import Link from "next/link";
import { cn } from "@/lib/cn";

const cls = (selected: boolean) =>
  cn(
    "inline-flex rounded-md border px-4 py-2 text-[14px] leading-[22px] font-medium whitespace-nowrap transition-[color,background-color,border-color,translate] duration-200 hover:-translate-y-0.5",
    selected ? "bg-ink border-ink text-surface" : "bg-surface border-line text-ink hover:border-cyan",
  );

/** Filter chip (Figma "Filter"): button or link variant. */
export function FilterButton({ selected, children, ...rest }: { selected: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-pressed={selected} className={cls(selected)} {...rest}>
      {children}
    </button>
  );
}

export function FilterLink({ selected, href, children }: { selected: boolean; href: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={selected ? "page" : undefined} className={cls(selected)} scroll={false}>
      {children}
    </Link>
  );
}
