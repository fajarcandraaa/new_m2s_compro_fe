import { cn } from "@/lib/cn";

/**
 * Diagram sebelum/sesudah (mockup `.ba`): kondisi awal dari `initialConditions`,
 * hasil dari `solutions`. `vertical` dipakai panel gelap di halaman Studi Kasus.
 */
export function BeforeAfter({
  before = [],
  after = [],
  beforeNote,
  afterNote,
  vertical = false,
}: {
  before?: string[];
  after?: string[];
  beforeNote?: string;
  afterNote?: string;
  vertical?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-[1] flex flex-col gap-3",
        !vertical && "md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4",
      )}
    >
      <div className="flex flex-col gap-3 rounded-xl border border-line p-5">
        <p className="text-tagline text-ink-muted">Sebelum</p>
        <Nodes items={before} />
        {beforeNote ? <p className="text-small text-ink-muted">{beforeNote}</p> : null}
      </div>

      <span
        aria-hidden="true"
        className={cn("self-center text-[24px] leading-none text-cyan-ink", vertical ? "rotate-90" : "rotate-90 md:rotate-0")}
      >
        &rarr;
      </span>

      <div className="flex flex-col gap-3 rounded-xl border border-cyan bg-surface p-5">
        <p className="text-tagline text-cyan-ink">Sesudah</p>
        <Nodes items={after} ok />
        {afterNote ? <p className="text-small text-ink">{afterNote}</p> : null}
      </div>
    </div>
  );
}

function Nodes({ items, ok = false }: { items: string[]; ok?: boolean }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "rounded-[4px] border px-2.5 py-0.5 text-small",
            ok ? "border-cyan text-ink" : "border-ink-muted text-ink-muted",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
