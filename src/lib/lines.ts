/** "One item per line" textarea helpers. */
export const linesToArray = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
export const arrayToLines = (a: string[] | null | undefined) => (a ?? []).join("\n");
