/**
 * Copy statis halaman Tentang.
 *
 * Tim dan perjalanan belum punya sumber data (tidak ada tabel di backend).
 * Sementara di-hide lewat flag di bawah; isi array-nya saat datanya tersedia,
 * lalu ubah flag menjadi true.
 */

export const SHOW_TEAM = false;
export const SHOW_JOURNEY = false;

export const STORY_LEAD =
  "Setelah bertahun-tahun di industri perangkat lunak dan melihat langsung tingginya ketidakpastian di ekosistem teknologi Indonesia, pendiri kami memilih jalan yang berbeda.";

export const STORY_BODY =
  "Yang dimulai sebagai perjalanan freelance perlahan menjadi tempat bagi para profesional untuk bertumbuh, berkolaborasi, dan membangun sistem yang benar-benar dipakai.";

export type Value = { number: string; title: string; body: string };

export const VALUES: Value[] = [
  { number: "01", title: "Ownership", body: "Kami memperlakukan sistem klien seperti milik sendiri." },
  { number: "02", title: "Kejujuran", body: "Kami bilang “tidak” saat sebuah keputusan akan merugikan Anda." },
  { number: "03", title: "Kualitas engineering", body: "Kode yang bersih dan terdokumentasi, aman untuk jangka panjang." },
  { number: "04", title: "Problem solving", body: "Kami mulai dari masalah, bukan dari daftar fitur." },
  { number: "05", title: "Kecepatan yang terukur", body: "Bergerak cepat tanpa melewatkan fase yang penting." },
];

export type Person = { name: string; role: string; photoUrl?: string };

/** Belum ada data tim di CMS. Isi di sini lalu set SHOW_TEAM = true. */
export const TEAM: Person[] = [];

export type Milestone = { when: string; title: string; body: string; next?: boolean };

/** Belum ada data perjalanan di CMS. Isi di sini lalu set SHOW_JOURNEY = true. */
export const JOURNEY: Milestone[] = [];

export const FOUNDED = { label: "Januari 2024", note: "Di Malang, Jawa Timur." };
