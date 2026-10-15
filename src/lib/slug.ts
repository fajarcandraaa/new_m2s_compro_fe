/**
 * Slug preview identical to the BE rule (gate1 FE-B2 / contract ServiceInput):
 * lowercase → NFKD and drop combining marks → `&` becomes ` dan ` → runs outside [a-z0-9] become `-`
 * → trim `-` → cut to 120 chars and trim a trailing `-`.  `AI & Teknologi` → `ai-dan-teknologi`.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
