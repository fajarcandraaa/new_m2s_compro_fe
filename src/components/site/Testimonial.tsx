import type { Testimonial as T } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";

/** Testimonial (Figma "Testimonial"): quote, name, role + company. */
export function Testimonial({ t, className }: { t: T; className?: string }) {
  const role = [t.clientRole, t.company].filter(Boolean).join(", ");
  return (
    <Card as="article" className={`flex flex-col gap-6 p-6 ${className ?? ""}`}>
      <blockquote className="text-body text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
      <p className="flex flex-col text-small">
        <span className="font-medium text-ink">{t.clientName}</span>
        {role ? <span className="text-ink-muted">{role}</span> : null}
      </p>
    </Card>
  );
}
