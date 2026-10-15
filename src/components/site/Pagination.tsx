import Link from "next/link";
import { cn } from "@/lib/cn";

/** Simple numbered pagination with text labels (no icons). */
export function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (p: number) => string }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const item = "inline-flex min-w-10 justify-center rounded-md border px-3 py-2 text-[14px] leading-[22px] font-medium";
  return (
    <nav aria-label="Halaman artikel" className="flex flex-wrap items-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={cn(item, "border-line bg-surface text-ink hover:border-cyan")}>
          Sebelumnya
        </Link>
      ) : null}
      {pages.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className={cn(item, "border-ink bg-ink text-surface")}>
            {p}
          </span>
        ) : (
          <Link key={p} href={hrefFor(p)} className={cn(item, "border-line bg-surface text-ink hover:border-cyan")}>
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={cn(item, "border-line bg-surface text-ink hover:border-cyan")}>
          Berikutnya
        </Link>
      ) : null}
    </nav>
  );
}
