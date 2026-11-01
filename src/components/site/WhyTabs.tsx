"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { WHYS } from "@/lib/content/cara-kerja";

/** Tab "kenapa penting" (mockup `.why` + `.wtab` + `.wpanel`): panel gelap di kanan. */
export function WhyTabs() {
  const [active, setActive] = useState(0);
  const why = WHYS[active] ?? WHYS[0];
  if (!why) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-stretch">
      <div className="flex flex-col self-start border-b border-line">
        {WHYS.map((w, i) => (
          <button
            key={w.word}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              "flex items-center justify-between gap-6 border-t border-line py-6 text-left text-[24px] leading-[32px] font-semibold transition-[color,padding-left] duration-300 hover:pl-2 lg:text-[32px] lg:leading-[40px]",
              i === active ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            <span>{w.word}</span>
            <span
              aria-hidden="true"
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan text-[18px] text-on-cyan transition-[opacity,translate] duration-300",
                i === active ? "opacity-100" : "-translate-x-2 opacity-0",
              )}
            >
              &rarr;
            </span>
          </button>
        ))}
      </div>

      <div
        key={why.word}
        className="anim-fadein relative flex min-h-[300px] flex-col justify-center gap-4 overflow-hidden rounded-2xl bg-[#080808] p-7 [--ink:#ffffff] [--ink-muted:#a3a3a3] lg:p-12"
      >
        <span
          aria-hidden="true"
          className="absolute right-[-20px] bottom-[-30px] h-[170px] w-[120px] bg-[linear-gradient(135deg,#30c2db,#43f4fa)] [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)]"
        />
        <h3 className="text-[28px] leading-[36px] font-semibold text-ink">{why.title}</h3>
        <p className="max-w-[420px] text-body text-ink-muted">{why.body}</p>
      </div>
    </div>
  );
}
