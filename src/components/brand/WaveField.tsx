"use client";

import { useEffect, useRef } from "react";
import { DotField } from "./DotField";

/**
 * Interactive hero dot field ("Gelombang titik mengikuti kursor", Figma 41:9548).
 *
 * - Grid: 8px dots, 32px pitch, 12px offset, colour `surface` (#181818) on dark ground.
 * - Influence radius 260px, wavelength 88px. At a crest a dot grows up to 15px, turns cyan
 *   (opacity 0.2–0.9) and is pushed outward by at most 9px. Outside the radius dots are still.
 * - Cursor position is lerped 0.12 per frame; the ripple decays over 600ms after the cursor
 *   stops or leaves the hero.
 * - Renders only while the hero is visible (IntersectionObserver); 30fps cap on weak devices.
 * - Touch devices (no hover): one slow ripple from the mark centre every 4s.
 * - prefers-reduced-motion: static dot field, no ripple.
 */

const PITCH = 32;
const OFFSET = 16; // dot centre = 12px offset + 4px radius
const BASE_R = 4;
const MAX_R = 7.5;
const RADIUS = 260;
const WAVELENGTH = 88;
const PUSH = 9;
const LERP = 0.12;
const DECAY_MS = 600;
const RIPPLE_SPEED = 0.09; // px per ms the waves travel outward under the cursor
const TOUCH_INTERVAL = 4000;
const TOUCH_DURATION = 2600;
const SURFACE = "#181818";

export function WaveField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchOnly = window.matchMedia("(hover: none)");
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    const frameBudget = weak ? 1000 / 30 : 0;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let lastFrame = 0;

    // pointer state
    const target = { x: -9999, y: -9999 };
    const pos = { x: -9999, y: -9999 };
    let lastMove = -Infinity;
    let inside = false;
    let leftAt = -Infinity;

    // touch ripple state
    let touchStart = performance.now() + 1200;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.ceil(rect.width);
      height = Math.ceil(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = SURFACE;
      ctx.beginPath();
      for (let y = OFFSET; y < height + PITCH; y += PITCH) {
        for (let x = OFFSET; x < width + PITCH; x += PITCH) {
          ctx.moveTo(x + BASE_R, y);
          ctx.arc(x, y, BASE_R, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    const markCenter = () => {
      const mark = host.querySelector<HTMLElement>("[data-mark-center]");
      const hostRect = host.getBoundingClientRect();
      if (!mark) return { x: width / 2, y: height / 2 };
      const r = mark.getBoundingClientRect();
      return { x: r.left - hostRect.left + r.width / 2, y: r.top - hostRect.top + r.height / 2 };
    };

    const drawWave = (cx: number, cy: number, amp: number, phaseShift: number, reach: number) => {
      ctx.clearRect(0, 0, width, height);
      // Base dots (outside the influence radius, or in a trough) in one path.
      const lit: Array<[number, number, number, number]> = [];
      ctx.fillStyle = SURFACE;
      ctx.beginPath();
      for (let y = OFFSET; y < height + PITCH; y += PITCH) {
        for (let x = OFFSET; x < width + PITCH; x += PITCH) {
          const dx = x - cx;
          const dy = y - cy;
          const d = Math.hypot(dx, dy);
          if (amp > 0.001 && d < reach) {
            const falloff = 1 - d / reach;
            const wave = Math.cos(((d - phaseShift) / WAVELENGTH) * Math.PI * 2);
            const crest = Math.max(0, wave) * falloff * falloff * amp;
            if (crest > 0.02) {
              const push = crest * PUSH;
              const nx = d > 0 ? dx / d : 0;
              const ny = d > 0 ? dy / d : 0;
              lit.push([x + nx * push, y + ny * push, BASE_R + (MAX_R - BASE_R) * crest, 0.2 + 0.7 * crest]);
              continue;
            }
          }
          ctx.moveTo(x + BASE_R, y);
          ctx.arc(x, y, BASE_R, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      for (const [x, y, r, a] of lit) {
        // Blend surface → cyan: draw the base dot, then cyan with crest opacity on top.
        ctx.fillStyle = SURFACE;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(48, 194, 219, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (frameBudget && now - lastFrame < frameBudget) return;
      lastFrame = now;

      if (touchOnly.matches) {
        const t = now - touchStart;
        if (t >= TOUCH_INTERVAL) touchStart = now;
        if (t < 0 || t > TOUCH_DURATION) {
          drawWave(0, 0, 0, 0, RADIUS);
          return;
        }
        const c = markCenter();
        const env = Math.sin((Math.PI * t) / TOUCH_DURATION);
        // A single slow ring travelling outward from the mark centre.
        drawWave(c.x, c.y, env, t * 0.12, RADIUS + 120);
        return;
      }

      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      const sinceStop = now - lastMove;
      const sinceLeave = inside ? 0 : now - leftAt;
      const idle = Math.max(sinceStop, sinceLeave);
      const amp = idle <= 0 ? 1 : Math.max(0, 1 - idle / DECAY_MS);
      drawWave(pos.x, pos.y, amp, now * RIPPLE_SPEED, RADIUS);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce.matches) {
        drawStatic();
        return;
      }
      if (visible) raf = requestAnimationFrame(frame);
      else drawStatic();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (!inside) {
        // Jump close to the entry point instead of sweeping across the hero.
        pos.x = target.x;
        pos.y = target.y;
      }
      inside = true;
      lastMove = performance.now();
    };
    const onLeave = () => {
      inside = false;
      leftAt = performance.now();
    };

    resize();
    start();
    if (fallbackRef.current) fallbackRef.current.style.display = "none";

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce.matches || !visible) drawStatic();
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        start();
      },
      { threshold: 0 },
    );
    io.observe(host);

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    reduce.addEventListener("change", start);
    touchOnly.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      reduce.removeEventListener("change", start);
      touchOnly.removeEventListener("change", start);
    };
  }, []);

  return (
    <>
      {/* SSR / no-JS fallback: identical static grid, hidden once the canvas has drawn. */}
      <div ref={fallbackRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <DotField />
      </div>
      <canvas ref={canvasRef} aria-hidden="true" className={className ?? "pointer-events-none absolute inset-0"} />
    </>
  );
}
