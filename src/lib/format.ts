const TZ = "Asia/Jakarta";

const dateFmt = new Intl.DateTimeFormat("id-ID", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "2 Mei 2026" in WIB. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return dateFmt.format(new Date(iso));
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return dateTimeFmt.format(new Date(iso)) + " WIB";
}

/** Parts of a date in WIB. */
function wibParts(d: Date) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

/**
 * Promo period per the promo date convention (gate1 FE-B3): endsAt is exclusive,
 * so the last day shown is (endsAt − 1 s) in Asia/Jakarta. "1–31 Oktober 2026".
 */
export function formatPromoPeriod(startsAt: string, endsAt: string): string {
  const s = wibParts(new Date(startsAt));
  const e = wibParts(new Date(new Date(endsAt).getTime() - 1000));
  const M = (m: number) => MONTHS[m - 1];
  if (s.y === e.y && s.m === e.m) {
    return s.d === e.d ? `${s.d} ${M(s.m)} ${s.y}` : `${s.d}–${e.d} ${M(e.m)} ${e.y}`;
  }
  if (s.y === e.y) return `${s.d} ${M(s.m)} – ${e.d} ${M(e.m)} ${e.y}`;
  return `${s.d} ${M(s.m)} ${s.y} – ${e.d} ${M(e.m)} ${e.y}`;
}
