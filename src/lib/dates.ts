/** Date helpers for the CMS. Business dates are Asia/Jakarta (UTC+7, no DST). */
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** ISO instant → "YYYY-MM-DD" in WIB. */
export function isoToWibDate(iso: string): string {
  const d = new Date(new Date(iso).getTime() + WIB_OFFSET_MS);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** ISO instant → "YYYY-MM-DDTHH:mm" (datetime-local) in WIB. */
export function isoToWibLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + WIB_OFFSET_MS);
  return `${isoToWibDate(iso)}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** datetime-local value (WIB) → RFC3339 with +07:00, or null when empty. */
export function wibLocalToIso(v: string): string | null {
  if (!v) return null;
  return `${v.length === 16 ? `${v}:00` : v}+07:00`;
}

function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number) as [number, number, number];
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/**
 * Promo date convention (gate1 FE-B3): endsAt is EXCLUSIVE.
 * "Mulai D"     → D 00:00 +07:00
 * "Berakhir D"  → (D+1) 00:00 +07:00
 * Display "Berakhir" as (endsAt − 1 s) in Asia/Jakarta.
 */
export const promoDates = {
  startToIso: (ymd: string) => `${ymd}T00:00:00+07:00`,
  endToIso: (ymd: string) => `${addDays(ymd, 1)}T00:00:00+07:00`,
  isoToStart: (iso: string) => isoToWibDate(iso),
  isoToEnd: (iso: string) => isoToWibDate(new Date(new Date(iso).getTime() - 1000).toISOString()),
};

/** "Hari ini" / "Kemarin" / "3 hari lalu" / date. */
export function relativeDay(iso: string | null | undefined): string {
  if (!iso) return "—";
  const today = isoToWibDate(new Date().toISOString());
  const day = isoToWibDate(iso);
  const diff = Math.round((Date.parse(today) - Date.parse(day)) / 86400000);
  if (diff <= 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  if (diff < 7) return `${diff} hari lalu`;
  if (diff < 14) return "1 minggu lalu";
  return new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}
