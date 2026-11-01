"use client";

import { createElement, useLayoutEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Animasi masuk saat elemen masuk viewport.
 *
 * Jalur utama: CSS scroll-driven (`animation-timeline: view()`) dari globals.css.
 * Jalur cadangan: IntersectionObserver + transition, dipasang sebelum paint
 * lewat useLayoutEffect supaya tidak ada kedipan pada browser tanpa dukungan
 * (Safari/Firefox saat komponen ini ditulis).
 * `prefers-reduced-motion: reduce`: tidak ada animasi, konten langsung tampil.
 */

type Variant = "rise" | "slide" | "grow" | "pop";
type Tag = "div" | "span" | "p" | "ul" | "ol" | "li" | "a" | "article" | "section" | "dl" | "h2" | "h3";

const HIDDEN: Record<Variant, CSSProperties> = {
  rise: { opacity: "0", transform: "translateY(36px)" },
  slide: { opacity: "0", transform: "translateX(-24px)" },
  grow: { opacity: "1", transform: "scaleX(0)", transformOrigin: "left" },
  pop: { opacity: "0", transform: "scale(0.85)" },
};
const SHOWN: Record<Variant, CSSProperties> = {
  rise: { opacity: "1", transform: "none" },
  slide: { opacity: "1", transform: "none" },
  grow: { opacity: "1", transform: "none" },
  pop: { opacity: "1", transform: "none" },
};

let nativeSupport: boolean | null = null;
function supportsScrollTimeline() {
  if (nativeSupport === null) {
    nativeSupport = typeof CSS !== "undefined" && CSS.supports("animation-timeline", "view()");
  }
  return nativeSupport;
}

export function Anim({
  variant = "rise",
  index = 0,
  as = "div",
  className,
  children,
  style,
  ...rest
}: {
  variant?: Variant;
  index?: number;
  as?: Tag;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || supportsScrollTimeline()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Sembunyikan sebelum paint, lalu buka saat elemen masuk viewport.
    Object.assign(el.style, HIDDEN[variant]);
    el.style.transition = "opacity .5s ease, transform .5s ease";
    el.style.transitionDelay = `${index * 0.08}s`;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          Object.assign(el.style, SHOWN[variant]);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variant, index]);

  return createElement(
    as,
    {
      ...rest,
      ref,
      className: cn(`anim-${variant}`, className),
      style: { "--i": index, ...style } as CSSProperties,
    },
    children,
  );
}
