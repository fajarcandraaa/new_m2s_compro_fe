import { cn } from "@/lib/cn";

/** Section head: eyebrow + heading (28/36) + optional intro, max 720px. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  className,
  as: As = "h2",
  id,
  introClassName,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
  id?: string;
  introClassName?: string;
}) {
  return (
    <div className={cn("flex max-w-[720px] flex-col gap-4", className)}>
      {eyebrow ? <p className="text-tagline text-cyan-ink">{eyebrow}</p> : null}
      <As id={id} className="text-heading text-ink">
        {title}
      </As>
      {intro ? <p className={cn("max-w-[640px] text-body text-ink-muted", introClassName)}>{intro}</p> : null}
    </div>
  );
}
