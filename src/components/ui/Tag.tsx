import { cn } from "@/lib/cn";

/** Tag (Figma "Tag"): Eyebrow = tagline style in cyan-ink; Chip = small bordered label (radius-sm). */
export function Eyebrow({ children, className, as: As = "p" }: { children: React.ReactNode; className?: string; as?: "p" | "span" | "div" }) {
  return <As className={cn("text-tagline text-cyan-ink", className)}>{children}</As>;
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-sm border border-line bg-surface px-2 py-1 text-small text-ink", className)}>
      {children}
    </span>
  );
}
