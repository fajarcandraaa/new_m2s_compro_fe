import { cn } from "@/lib/cn";

/** Card (Figma "Card"): surface + line border, radius-lg, no shadow. */
export function Card({
  className,
  children,
  as: As = "div",
  ...rest
}: { className?: string; children: React.ReactNode; as?: "div" | "article" | "section" | "li" } & React.HTMLAttributes<HTMLElement>) {
  return (
    <As className={cn("rounded-lg border border-line bg-surface", className)} {...rest}>
      {children}
    </As>
  );
}

/** Numbered info card used in Masalah / Sistem sections. */
export function InfoCard({ eyebrow, title, body, className }: { eyebrow: string; title: string; body: string; className?: string }) {
  return (
    <Card className={cn("flex flex-col gap-4 p-6", className)}>
      <p className="text-tagline text-cyan-ink">{eyebrow}</p>
      <h3 className="text-title text-ink">{title}</h3>
      <p className="text-small text-ink-muted">{body}</p>
    </Card>
  );
}
