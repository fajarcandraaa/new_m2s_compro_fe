/** Tahapan kerja dan model kerja (BOS/BOR) — dipakai beranda, cara kerja, dan layanan. */

export type Step = {
  number: string;
  title: string;
  body: string;
  points: string[];
  output: string;
  /** Diagram kecil di panel stepper beranda. */
  diagram: "lines" | "grid" | "modules" | "bars";
};

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Discovery & Alignment",
    body: "Workshop dengan tim Anda untuk memetakan tujuan, masalah, dan proses yang berjalan.",
    points: ["Dokumen kebutuhan", "Blueprint sistem"],
    output: "Dokumen kebutuhan dan blueprint sistem",
    diagram: "lines",
  },
  {
    number: "02",
    title: "System Blueprint",
    body: "Arsitektur, skema database, mockup UI/UX, dan dokumentasi teknis disetujui sebelum development dimulai.",
    points: ["Arsitektur dan skema database", "Mockup UI/UX", "Dokumentasi teknis"],
    output: "Rancangan yang disetujui bersama",
    diagram: "grid",
  },
  {
    number: "03",
    title: "Modular Implementation",
    body: "Pengembangan bertahap per modul, dengan demo rutin dan umpan balik dari tim Anda.",
    points: ["Modul diuji sebelum lanjut", "Demo rutin", "Umpan balik dari tim Anda"],
    output: "Modul yang berjalan dan sudah diuji",
    diagram: "modules",
  },
  {
    number: "04",
    title: "Stabilization & Growth",
    body: "Pendampingan setelah go-live, pelatihan tim internal, dan pengembangan lanjutan.",
    points: ["Pendampingan setelah go-live", "Pelatihan tim internal", "Pengembangan lanjutan"],
    output: "Tim siap mengelola dan mengembangkan sistem",
    diagram: "bars",
  },
];

export type WorkModel = {
  key: "bos" | "bor";
  label: string;
  short: string;
  title: string;
  body: string;
  timeline: { label: string; kind: "lock" | "sprint" | "next" }[];
  note: string;
};

export const WORK_MODELS: WorkModel[] = [
  {
    key: "bos",
    label: "BOS · Based on Scope",
    short: "Harga tetap, scope dikunci di awal",
    title: "Harga tetap, scope dikunci di awal",
    body: "Cocok jika kebutuhan sudah terdokumentasi dan jarang berubah. Tahapan berurutan, anggaran pasti.",
    timeline: [
      { label: "Fase 1", kind: "lock" },
      { label: "Fase 2", kind: "lock" },
      { label: "Fase 3", kind: "lock" },
    ],
    note: "Scope terkunci, evaluasi di akhir tiap fase besar",
  },
  {
    key: "bor",
    label: "BOR · Based on Request",
    short: "Sprint 1–2 minggu, fleksibel",
    title: "Sprint 1–2 minggu, fleksibel",
    body: "Cocok untuk produk baru atau pengembangan berkelanjutan. Dibayar sesuai waktu kerja yang dipakai.",
    timeline: [
      { label: "S1", kind: "sprint" },
      { label: "S2", kind: "sprint" },
      { label: "S3", kind: "sprint" },
      { label: "S4", kind: "sprint" },
      { label: "…", kind: "next" },
    ],
    note: "Prioritas bisa berubah, evaluasi di akhir tiap sprint",
  },
];

/** Baris perbandingan BOS vs BOR untuk halaman Layanan. */
export const WORK_MODEL_ROWS: Array<[string, string, string]> = [
  ["Fokus", "Kepastian hasil akhir", "Kecepatan dan fleksibilitas"],
  ["Ruang lingkup", "Dikunci di awal kontrak", "Bisa berubah tiap sprint"],
  ["Biaya", "Harga tetap per proyek", "Sesuai waktu kerja yang dipakai"],
  ["Evaluasi", "Di akhir tiap fase besar", "Di akhir tiap sprint 1–2 minggu"],
  ["Paling cocok", "Kebutuhan sudah terdokumentasi", "MVP atau pengembangan berkelanjutan"],
];
