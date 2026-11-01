/** Copy statis halaman Cara Kerja. */

export const MISCONCEPTIONS: string[] = [
  "Pengembangan berbasis fitur tanpa pemetaan kebutuhan yang matang",
  "Melewatkan fase discovery demi kecepatan semu",
  "Sistem yang tidak dirancang untuk berubah",
  "Vendor yang selesai di delivery, lalu menghilang",
];

export type Principle = { number: string; title: string; body: string };

export const PRINCIPLES: Principle[] = [
  {
    number: "01",
    title: "Kami mulai dari kejelasan, bukan kode",
    body: "Membangun sistem tanpa kejelasan hanya mempercepat kegagalan.",
  },
  {
    number: "02",
    title: "Kami merancang untuk perubahan",
    body: "Sistem yang baik bukan yang paling lengkap, tetapi yang tetap stabil saat kebutuhan berubah.",
  },
  {
    number: "03",
    title: "Kami lebih sering berkata “tidak”",
    body: "Menolak keputusan buruk di awal jauh lebih murah daripada memperbaikinya di akhir.",
  },
  {
    number: "04",
    title: "Kami berpikir sebagai partner",
    body: "Tugas kami bukan sekadar mengerjakan, tetapi menjaga sistem bisnis Anda tetap masuk akal.",
  },
];

export type Why = { word: string; title: string; body: string };

export const WHYS: Why[] = [
  {
    word: "Efisiensi",
    title: "Proses operasional lebih efisien",
    body: "Tim berhenti mengerjakan ulang hal yang sama dan menunggu rekap manual.",
  },
  {
    word: "Keteraturan",
    title: "Data rapi, perubahan terkelola",
    body: "Setiap perubahan terdokumentasi dan bisa ditelusuri.",
  },
  {
    word: "Pertumbuhan",
    title: "Tumbuh tanpa dibangun ulang",
    body: "Modul baru ditambahkan tanpa membongkar yang sudah berjalan.",
  },
];
