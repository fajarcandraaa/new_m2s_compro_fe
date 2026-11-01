"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { STEPS, type Step } from "@/lib/content/process";

/** Stepper empat tahap (mockup `.steps` + `.stage`): pilih tahap, panel kanan menampilkan diagram. */
export function ProcessStepper() {
  const [active, setActive] = useState(0);
  const step = STEPS[active] ?? STEPS[0];
  if (!step) return null;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4" role="group" aria-label="Tahap kerja">
        {STEPS.map((s, i) => {
          const done = i < active;
          const on = i === active;
          return (
            <button
              key={s.number}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={on}
              className={cn(
                "flex flex-col gap-3 text-left transition-opacity duration-300 hover:opacity-100",
                on || done ? "opacity-100" : "opacity-55",
              )}
            >
              <span className="block h-[3px] overflow-hidden rounded-sm bg-line">
                <span
                  className={cn("block h-full origin-left bg-cyan transition-transform duration-[600ms] ease-out", on || done ? "scale-x-100" : "scale-x-0")}
                />
              </span>
              <span className="text-tagline text-cyan-ink">{s.number}</span>
              <span className="text-title text-ink">{s.title}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-stretch">
        <div key={`text-${step.number}`} className="anim-fadein flex flex-col justify-center gap-5">
          <h3 className="text-heading text-ink">{step.title}</h3>
          <p className="text-body text-ink-muted">{step.body}</p>
          <ul className="flex flex-col gap-2">
            {step.points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[9px] h-2 w-2 shrink-0 bg-cyan [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]" />
                <span className="text-body text-ink">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div key={`art-${step.number}`} className="anim-fadein flex min-h-[280px] items-center justify-center overflow-hidden rounded-lg border border-line bg-surface p-8">
          <Diagram kind={step.diagram} />
        </div>
      </div>
    </div>
  );
}

function Diagram({ kind }: { kind: Step["diagram"] }) {
  if (kind === "lines") {
    const widths = ["90%", "100%", "72%", "86%", "48%"];
    return (
      <div className="flex w-full flex-col gap-3.5" aria-hidden="true">
        {widths.map((w, i) => (
          <span
            key={w}
            className={cn("block h-2.5 origin-left rounded-[5px] bg-line", i === 0 && "bg-cyan")}
            style={{ width: w, animation: `anim-grow .7s ease both`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }
  if (kind === "grid") {
    return (
      <div className="grid w-full grid-cols-3 gap-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "block h-14 rounded-md",
              i === 0 || i === 4 ? "border-[1.5px] border-cyan" : "border-[1.5px] border-dashed border-ink-muted",
            )}
            style={{ animation: "anim-pop .5s ease both", animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    );
  }
  if (kind === "modules") {
    return (
      <div className="grid w-full grid-cols-2 gap-3" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "block h-[72px] rounded-xl",
              i === 3 ? "border-[1.5px] border-dashed border-ink-muted" : "bg-[linear-gradient(135deg,#30c2db,#43f4fa)]",
            )}
            style={{ animation: "anim-pop .5s ease both", animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </div>
    );
  }
  const heights = ["30%", "45%", "60%", "78%", "100%"];
  return (
    <div className="flex h-[150px] w-full items-end gap-3" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={h}
          className="block flex-1 origin-bottom rounded-t bg-[linear-gradient(180deg,#43f4fa,#30c2db)]"
          style={{ height: h, animation: `anim-grow-y .7s ease both`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
