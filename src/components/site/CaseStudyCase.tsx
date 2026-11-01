import Link from "next/link";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import type { CaseStudySummary } from "@/lib/api/types";

/** Kartu studi kasus dua kolom (mockup `.case`): ringkasan terang + diagram gelap. */
export function CaseStudyCase({ cs }: { cs: CaseStudySummary }) {
  return (
    <article className="group grid overflow-hidden rounded-2xl border border-line bg-surface transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-cyan lg:grid-cols-[7fr_5fr]">
      <div className="flex flex-col gap-4 p-7 lg:p-10">
        <p className="text-tagline text-cyan-ink">
          {cs.systemName} · {cs.category}
        </p>
        <h3 className="text-[28px] leading-[36px] font-semibold text-ink">{cs.title}</h3>
        <p className="text-body text-ink-muted">{cs.cardBody || cs.summary}</p>
        <Link
          href={`/studi-kasus/${cs.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-2 font-medium text-cyan-ink hover:underline"
        >
          Baca studi kasus
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
            &rarr;
          </span>
          <span className="sr-only">: {cs.title}</span>
        </Link>
      </div>

      <div
        data-theme="dark"
        className="relative flex flex-col justify-center overflow-hidden bg-[#080808] p-7 lg:p-10"
        style={{
          backgroundImage: "radial-gradient(#181818 1.6px, transparent 1.8px)",
          backgroundSize: "32px 32px",
        }}
      >
        <BeforeAfter
          vertical
          before={cs.initialConditions}
          beforeNote={cs.initialConditionsTitle}
          after={cs.solutions}
          afterNote={cs.impactTitle}
        />
      </div>
    </article>
  );
}
