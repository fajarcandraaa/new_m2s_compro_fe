/**
 * Copy statis section beranda. Tidak ada di CMS — ubah di sini bila teks berubah.
 * (Nilai yang berasal dari backend: layanan, studi kasus, promo, testimoni, logo.)
 */

export type Problem = { number: string; title: string; body: string };

export const PROBLEMS: Problem[] = [
  {
    number: "01",
    title: "Kebutuhan tidak jelas",
    body: "Requirement berubah-ubah, fitur dibuat tapi tidak dipakai, dan sistem akhirnya tidak cocok dengan cara kerja tim.",
  },
  {
    number: "02",
    title: "Perubahan kecil merusak sistem",
    body: "Tanpa dokumentasi dan struktur yang rapi, setiap update terasa berisiko sehingga tim takut mengubah apa pun.",
  },
  {
    number: "03",
    title: "Sistem tidak ikut tumbuh",
    body: "Bisnis berkembang, tapi sistem tidak bisa mengikuti. Vendor sulit dihubungi dan biaya perawatan membengkak.",
  },
];

export type SystemTile = {
  eyebrow: string;
  title: string;
  body: string;
  chips?: string[];
  variant: "hris" | "dms" | "portal" | "custom";
};

export const SYSTEMS: SystemTile[] = [
  {
    eyebrow: "HRIS",
    title: "HRIS & Employee Management",
    body: "Absensi, cuti, payroll, penilaian kinerja, dan layanan mandiri karyawan dalam satu sistem.",
    chips: ["Absensi", "Cuti", "Payroll", "Penilaian kinerja", "Layanan mandiri"],
    variant: "hris",
  },
  {
    eyebrow: "DMS",
    title: "Document Management & Approval",
    body: "Alur persetujuan yang bisa dikonfigurasi, arsip dokumen, dan jejak audit untuk setiap keputusan.",
    variant: "dms",
  },
  {
    eyebrow: "Portal",
    title: "Internal Portal & Reporting",
    body: "Dashboard KPI dan laporan yang diperbarui otomatis untuk manajemen dan tiap divisi.",
    variant: "portal",
  },
  {
    eyebrow: "Custom",
    title: "Sistem Operasional Custom",
    body: "Sistem yang mengikuti proses unik perusahaan Anda, dari gudang sampai layanan lapangan.",
    variant: "custom",
  },
];

export const FIT_YES: string[] = [
  "Pemilik bisnis yang lelah dengan proses manual dan sistem yang terpisah-pisah",
  "Perusahaan dengan proses bisnis yang kompleks",
  "Tim yang pernah gagal mengimplementasikan sistem internal",
  "Organisasi yang mencari partner jangka panjang",
];

export const FIT_NO: string[] = [
  "Proyek yang hanya mengejar harga termurah dan hasil instan",
  "Proyek tanpa komitmen untuk fase discovery",
  "Permintaan perbaikan cepat tanpa mau membenahi proses",
];
