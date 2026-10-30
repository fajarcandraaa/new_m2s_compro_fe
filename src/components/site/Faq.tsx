import type { FaqItem } from "@/lib/api/types";
import { cn } from "@/lib/cn";

/**
 * "Pertanyaan umum": native <details>/<summary> accordion so every answer is in the server HTML
 * (crawlers, AI engines, no-JS). Renders nothing when there are no FAQs.
 */
export function Faq({ items, className, id = "faq" }: { items: FaqItem[] | undefined; className?: string; id?: string }) {
  if (!items?.length) return null;
  return (
    <section aria-labelledby={id} className={cn("flex flex-col gap-4", className)}>
      <p className="text-tagline text-cyan-ink">FAQ</p>
      <h2 id={id} className="text-heading text-ink">
        Pertanyaan umum
      </h2>
      <div className="border-b border-line">
        {items.map((f, i) => (
          <details key={`${i}-${f.question}`} open={i === 0} className="group border-t border-line">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-title text-ink hover:text-cyan-ink [&::-webkit-details-marker]:hidden">
              <h3 className="text-title">{f.question}</h3>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-0.5 h-6 w-6 shrink-0 text-cyan-ink transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="pb-6 text-body whitespace-pre-line text-ink-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
