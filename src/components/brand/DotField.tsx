import { cn } from "@/lib/cn";

/**
 * Static brand dot field: 8px dots in `surface` colour, 32px pitch, 12px offset,
 * on dark ground. Purely decorative; place behind content in a dark scope.
 * `lit` menambah lapisan dot cyan yang menyala dari tengah saat section
 * masuk viewport (scroll-driven, lihat `.dot-lit` di globals.css).
 */
export function DotField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: "radial-gradient(circle at 16px 16px, var(--surface) 3.6px, transparent 4.4px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}
