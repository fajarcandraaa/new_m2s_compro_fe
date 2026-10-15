"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Section reveal on scroll: fade + translateY 16px, once.
 * prefers-reduced-motion: shown immediately in the final state (duration 0, no scroll trigger).
 * The SSR markup is identical either way to avoid hydration mismatches.
 */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      {...(reduce ? { animate: { opacity: 1, y: 0 } } : { whileInView: { opacity: 1, y: 0 } })}
      viewport={{ once: true, amount: 0.1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
