"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { WORK_MODELS } from "@/lib/content/process";

/** Segmented control BOS/BOR (mockup `.seg` + `.model`). */
export function ModelSwitch() {
  const [active, setActive] = useState<"bos" | "bor">("bos");
  const model = WORK_MODELS.find((m) => m.key === active) ?? WORK_MODELS[0];
  if (!model) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit gap-1 rounded-md border border-line bg-surface p-1" role="group" aria-label="Model kerja">
        {WORK_MODELS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setActive(m.key)}
            aria-pressed={m.key === active}
            className={cn(
              "min-h-11 rounded-sm px-5 py-2.5 text-body font-medium transition-colors",
              m.key === active ? "bg-cyan text-on-cyan" : "text-ink hover:bg-surface/60 hover:text-cyan-ink",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div key={model.key} className="anim-fadein grid gap-8 rounded-lg border border-line bg-surface p-8 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-title text-ink">{model.title}</h3>
          <p className="text-body text-ink-muted">{model.body}</p>
        </div>
        <div>
          <div className="flex h-14 items-stretch gap-2" aria-hidden="true">
            {model.timeline.map((t, i) => (
              <span
                key={`${t.label}-${i}`}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-md text-[13px] font-medium",
                  t.kind === "lock" && "bg-cyan text-on-cyan",
                  t.kind === "sprint" && "border-[1.5px] border-cyan text-ink",
                  t.kind === "next" && "border-[1.5px] border-dashed border-ink-muted text-ink-muted",
                )}
                style={{ animation: "anim-pop .45s ease both", animationDelay: `${i * 0.12}s` }}
              >
                {t.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-small text-ink-muted">{model.note}</p>
        </div>
      </div>
    </div>
  );
}
