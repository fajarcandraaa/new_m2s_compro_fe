"use client";

import { motion, useReducedMotion } from "motion/react";
import { BrandScreen } from "./BrandScreen";
import { BrandStar } from "./BrandStar";

/**
 * Hero visual "Ide menjadi layar" (Figma component "Hero Visual", stages 1–5).
 * t=0 star appears (scale 0.6→1), 0.6s left screen rises (y+160→0), 1.2s right screen
 * rises (y+200→0), 1.8s lit dots switch on from the centre, then an idle "breathing"
 * loop (left y ±8, right y ∓8, 2.4s ease-in-out, yoyo).
 * prefers-reduced-motion: static stage 4.
 */

// Lit dots: 32px grid inside a 640 box, kept within a circle, opacity falling off to the edge.
const LIT_DOTS = (() => {
  const dots: Array<{ x: number; y: number; o: number; d: number }> = [];
  for (let y = 16; y < 640; y += 32) {
    for (let x = 16; x < 640; x += 32) {
      const dist = Math.hypot(x - 320, y - 320);
      if (dist > 300) continue;
      const t = dist / 300;
      dots.push({ x, y, o: 0.16 + 0.26 * (1 - t), d: t });
    }
  }
  return dots;
})();

const INTRO_END = 2.5;

export function HeroVisual({ className }: { className?: string }) {
  // SSR markup is always the animated one; on the client prefers-reduced-motion
  // collapses every transition to 0 s (final state) and disables the idle loop.
  const reduce = useReducedMotion() === true;
  const T = (t: object) => (reduce ? { duration: 0 } : t);

  return (
    <div className={className} aria-hidden="true" data-hero-visual>
      <div className="relative aspect-square w-full">
        <svg viewBox="0 0 640 640" className="absolute inset-0 h-full w-full">
          {LIT_DOTS.map((p) => (
            <circle
              key={`${p.x}-${p.y}`}
              cx={p.x}
              cy={p.y}
              r={3}
              fill="#30C2DB"
              className="hero-lit-dot"
              style={{ "--o": p.o, animationDelay: `${1.8 + p.d * 0.6}s` } as React.CSSProperties}
            />
          ))}
        </svg>

        {/* Left screen */}
        <motion.div
          className="absolute top-[15%] left-[35.94%] h-[69.06%] w-[26.56%]"
          initial={{ y: "36%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={T({ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] })}
        >
          <motion.div
            className="h-full w-full"
            animate={reduce ? { y: 0 } : { y: [0, -8, 0, 8, 0] }}
            transition={T({ delay: INTRO_END, duration: 4.8, ease: "easeInOut", repeat: Infinity })}
          >
            <BrandScreen className="h-full w-full" />
          </motion.div>
        </motion.div>

        {/* Right screen */}
        <motion.div
          className="absolute top-[9.375%] left-[65.63%] h-[85.31%] w-[32.81%]"
          initial={{ y: "36.6%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={T({ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] })}
        >
          <motion.div
            className="h-full w-full"
            animate={reduce ? { y: 0 } : { y: [0, 8, 0, -8, 0] }}
            transition={T({ delay: INTRO_END, duration: 4.8, ease: "easeInOut", repeat: Infinity })}
          >
            <BrandScreen className="h-full w-full" />
          </motion.div>
        </motion.div>

        {/* Star (idea) */}
        <motion.div
          data-mark-center
          className="absolute top-[26.56%] left-[10.94%] h-[28.125%] w-[28.125%]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={T({ duration: 0.6, ease: "easeOut" })}
        >
          <BrandStar className="h-full w-full" />
        </motion.div>
      </div>
    </div>
  );
}
