import { useId } from "react";

/**
 * Brand "layar miring" (slanted screen): path M0 170 L200 0 L200 350 L0 520 Z
 * in a 200×520 box, corner radius 8, brand gradient cyan → cyan-glow (bottom-right).
 * Always scale uniformly (width : height = 200 : 520).
 */
const W = 200;
const H = 520;
const R = 8;
const POINTS: Array<[number, number]> = [
  [0, 170],
  [200, 0],
  [200, 350],
  [0, 520],
];

function roundedPolygon(points: Array<[number, number]>, r: number): string {
  const n = points.length;
  const segs: string[] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n]!;
    const cur = points[i]!;
    const next = points[(i + 1) % n]!;
    const v1 = [prev[0] - cur[0], prev[1] - cur[1]] as const;
    const v2 = [next[0] - cur[0], next[1] - cur[1]] as const;
    const l1 = Math.hypot(v1[0], v1[1]);
    const l2 = Math.hypot(v2[0], v2[1]);
    const a = [cur[0] + (v1[0] / l1) * r, cur[1] + (v1[1] / l1) * r];
    const b = [cur[0] + (v2[0] / l2) * r, cur[1] + (v2[1] / l2) * r];
    segs.push(`${i === 0 ? "M" : "L"}${a[0]!.toFixed(2)} ${a[1]!.toFixed(2)}`);
    segs.push(`Q${cur[0]} ${cur[1]} ${b[0]!.toFixed(2)} ${b[1]!.toFixed(2)}`);
  }
  return segs.join(" ") + " Z";
}

export const BRAND_SCREEN_PATH = roundedPolygon(POINTS, R);

export function BrandScreen({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`bs-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#30C2DB" />
          <stop offset="1" stopColor="#43F4FA" />
        </linearGradient>
      </defs>
      <path d={BRAND_SCREEN_PATH} fill={`url(#bs-${id})`} />
    </svg>
  );
}
