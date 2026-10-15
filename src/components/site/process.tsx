import { Card } from "@/components/ui/Card";

/** Shared process copy (Figma Beranda "Proses" + Cara Kerja). */
export const STEPS = [
  {
    number: "01",
    title: "Discovery & Alignment",
    body: "Workshop dengan tim Anda untuk memetakan tujuan, masalah, dan proses yang berjalan. Hasilnya dokumen kebutuhan dan blueprint sistem.",
  },
  {
    number: "02",
    title: "System Blueprint",
    body: "Arsitektur, skema database, mockup UI/UX, dan dokumentasi teknis disetujui sebelum development dimulai.",
  },
  {
    number: "03",
    title: "Modular Implementation",
    body: "Pengembangan bertahap per modul, dengan demo rutin dan umpan balik dari tim Anda.",
  },
  {
    number: "04",
    title: "Stabilization & Growth",
    body: "Pendampingan setelah go-live, pelatihan tim internal, dan pengembangan lanjutan.",
  },
];

export function ModelPanels() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      <Card className="flex flex-col gap-2 p-6 lg:p-8">
        <p className="text-tagline text-cyan-ink">BOS · Based on Scope</p>
        <h3 className="text-title text-ink">Harga tetap, scope dikunci di awal</h3>
        <p className="text-small text-ink-muted">
          Cocok jika kebutuhan sudah terdokumentasi dan jarang berubah. Tahapan berurutan, anggaran pasti.
        </p>
      </Card>
      <Card className="flex flex-col gap-2 p-6 lg:p-8">
        <p className="text-tagline text-cyan-ink">BOR · Based on Request</p>
        <h3 className="text-title text-ink">Sprint 1–2 minggu, fleksibel</h3>
        <p className="text-small text-ink-muted">
          Cocok untuk produk baru atau pengembangan berkelanjutan. Dibayar sesuai waktu kerja yang dipakai.
        </p>
      </Card>
    </div>
  );
}

