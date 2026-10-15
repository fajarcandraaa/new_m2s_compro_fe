/** Brand 4-point star (idea symbol), 100×100 path, cyan. */
export const BRAND_STAR_PATH =
  "M50 0 C53 36 60 46 100 50 C60 54 53 64 50 100 C47 64 40 54 0 50 C40 46 47 36 50 0 Z";

export function BrandStar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true" focusable="false">
      <path d={BRAND_STAR_PATH} fill="#30C2DB" />
    </svg>
  );
}
