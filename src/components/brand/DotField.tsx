import { cn } from "@/lib/cn";

/**
 * Static brand dot field: 8px dots in `surface` colour, 32px pitch, 12px offset,
 * on dark ground. Purely decorative; place behind content in a dark scope.
 * `lit` menambah lapisan dot cyan yang menyala dari tengah saat section
 * masuk viewport (scroll-driven, lihat `.dot-lit` di globals.css).
 */
export function DotField({ className, lit = false }: { className?: string; lit?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 16px 16px, var(--surface) 3.6px, transparent 4.4px)",
          backgroundSize: "32px 32px",
        }}
      />
      {lit ? (
        <div
          className="dot-lit absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 16px 16px, rgb(48 194 219 / 0.38) 2.4px, transparent 3.2px)",
            backgroundSize: "32px 32px",
          }}
        />
      ) : null}
    </div>
  );
}
