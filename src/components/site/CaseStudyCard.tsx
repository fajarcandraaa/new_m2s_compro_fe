import Link from "next/link";
import type { CaseStudySummary } from "@/lib/api/types";
import { Card } from "@/components/ui/Card";

/** Case Study Card (Figma): eyebrow "SYSTEM · CATEGORY", title, body, two impact numbers from CMS. */
export function CaseStudyCard({ cs, headingLevel = "h3" }: { cs: CaseStudySummary; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Card as="article" className="relative flex h-full flex-col gap-6 p-6 transition-colors hover:border-cyan lg:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-tagline text-cyan-ink">
          {cs.systemName} · {cs.category}
        </p>
        <H className="text-heading text-ink">{cs.title}</H>
      </div>
      <p className="text-body text-ink-muted">{cs.cardBody || cs.summary}</p>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-line pt-6">
        {cs.metrics.map((m) => (
          <div key={m.label} className="flex flex-col-reverse">
            <dt className="text-small text-ink-muted">{m.label}</dt>
            <dd className="text-display text-ink">{m.value}</dd>
          </div>
        ))}
      </dl>
      <Link href={`/studi-kasus/${cs.slug}`} className="mt-auto font-medium text-cyan-ink after:absolute after:inset-0 after:content-['']">
        Baca studi kasus<span className="sr-only">: {cs.title}</span>
      </Link>
    </Card>
  );
}
