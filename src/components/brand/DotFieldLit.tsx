"use client";

import { useEffect, useRef } from "react";
import { DotField } from "./DotField";

/**
 * Dot field gelap dengan animasi "menyala dari tengah" (mirip hero).
 * Animasi dipicu sekali saat section masuk viewport.
 */
export function DotFieldLit() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.lit = "true";
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="dot-lit-host pointer-events-none absolute inset-0">
      <DotField lit />
    </div>
  );
}
