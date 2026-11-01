"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { WHYS } from "@/lib/content/cara-kerja";

/** Tab "kenapa penting" (mockup `.why` + `.wpanel`). */
export function WhyTabs() {
  const [active, setActive] = useState(0);
  const why = WHYS[active] ?? WHYS[0];
  if (!why) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:items-start">
      <div className="flex flex-col border-b border-line">
        {WHYS.map((w, i) => (
          <button
            key={w.word}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              "flex items-center justify-between gap-6 border-t border-line py-5 text-left text-title transition-colors",
              i === active ? "text-cyan-ink" : "text-ink hover:text-cyan-ink",
            )}
          >
            <span>{w.word}</span>
            <span aria-hidden="true" className={cn("transition-transform", i === active && "translate-x-1")}>
              →
            </span>
          </button>
        ))}
      </div>

      <div key={why.word} className="anim-fadein relative overflow-hidden rounded-lg border border-line bg-surface p-6 lg:p-10">
        <span
          aria-hidden="true"
          className="absolute -right-5 -bottom-8 h-[170px] w-[120px] bg-[linear-gradient(135deg,#30c2db,#43f4fa)] opacity-90 [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]"
        />
        <div className="relative flex flex-col gap-3">
          <h3 className="text-heading text-ink">{why.title}</h3>
          <p className="max-w-[420px] text-body text-ink-muted">{why.body}</p>
        </div>
      </div>
    </div>
  );
}
