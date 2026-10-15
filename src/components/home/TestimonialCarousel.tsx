"use client";

import { useRef, useState } from "react";
import { Testimonial } from "@/components/site/Testimonial";
import type { Testimonial as T } from "@/lib/api/types";
import { cn } from "@/lib/cn";

/** Desktop: 3-column row. Mobile: swipeable carousel with pager (Figma 36:1862). */
export function TestimonialCarousel({ items }: { items: T[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    setActive(Math.min(items.length - 1, Math.max(0, i)));
  };
  const go = (i: number) => {
    const el = track.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-8">
      <ul
        ref={track}
        onScroll={onScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:snap-none lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0"
      >
        {items.map((t) => (
          <li key={t.id} className="w-full shrink-0 snap-start lg:w-auto">
            <Testimonial t={t} className="h-full" />
          </li>
        ))}
      </ul>
      {items.length > 1 ? (
        <div className="flex gap-2 lg:hidden" role="group" aria-label="Pilih testimoni">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Testimoni ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => go(i)}
              className="flex h-6 items-center"
            >
              <span className={cn("block h-1 rounded-sm transition-all", i === active ? "w-6 bg-cyan" : "w-2 bg-line")} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
