import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { getSite } from "@/lib/api/public";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Kebijakan Privasi",
  description:
    "Data apa yang kami kumpulkan saat Anda mengunjungi situs ini, dasar hukumnya, siapa yang menjadi pengendali data, dengan siapa data dibagikan, dan cara mengajukan permintaan data pribadi.",
  path: "/kebijakan-privasi",
});

/** Tanggal berlaku terakhir. Perbarui manual setiap isi kebijakan berubah. */
const UPDATED_AT = "2 November 2026";

export default async function KebijakanPrivasiPage() {
  const site = await getSite();
  const wa = whatsappUrl(site.whatsappNumber, site.whatsappGreeting);

  return (
    <>
      <PageHero
        eyebrow="Privasi"
        title="Kebijakan Privasi"
        lead={`Halaman ini menjelaskan siapa yang mengendalikan data Anda di situs ini, data apa yang kami kumpulkan, dasar hukumnya, dan cara mengajukan permintaan atas data pribadi Anda. Terakhir diperbarui ${UPDATED_AT}.`}
      />

      <section className="section-block">
        <div className="container-narrow flex flex-col gap-10">
          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Pengendali data</h2>
            <p className="text-body text-ink-muted">
              Pengendali data pribadi pada situs ini adalah <strong className="text-ink">{site.legalName}</strong>,
              berkedudukan di {site.address}.
            </p>
            <p className="text-body text-ink-muted">
              Kontak pengendali data:{" "}
              <a href={`mailto:${site.email}`} className="text-cyan-ink underline underline-offset-4">
                {site.email}
              </a>
              {site.whatsappDisplay ? (
                <>
                  {" atau WhatsApp "}
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-ink underline underline-offset-4"
                  >
                    {site.whatsappDisplay}
                  </a>
                </>
              ) : null}
              .
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Data yang kami kumpulkan dan dasar pemrosesannya</h2>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Statistik kunjungan.</strong> Situs ini memakai Google Analytics 4. Google
              Analytics menyimpan cookie (misalnya <code className="text-ink">_ga</code>) berisi ID pengunjung acak, lalu
              mencatat halaman yang dibuka, jenis perangkat dan browser secara umum, serta alamat situs perujuk. Alamat
              IP dipakai Google Analytics pada tahap pengumpulan untuk menentukan perkiraan lokasi geografis, lalu
              dibuang sebelum data dicatat di server Analytics. Tujuan: memahami halaman mana yang dipakai dan memperbaiki isi
              situs. Dasar pemrosesan: kepentingan sah kami untuk mengukur pemakaian situs dengan data yang tidak
              mengidentifikasi Anda secara langsung. Anda berhak mengajukan keberatan atas pemrosesan ini.
            </p>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Formulir diskusi.</strong> Saat Anda mengirim formulir, kami menyimpan nama,
              email, nomor WhatsApp, nama perusahaan (opsional), layanan yang diminati, perkiraan waktu mulai, dan isi
              pesan. Tujuan: menindaklanjuti permintaan Anda dan menyiapkan penawaran. Dasar pemrosesan: persetujuan
              yang Anda berikan saat mengirim formulir. Nama, email, nomor WhatsApp, perusahaan, perkiraan waktu
              mulai, dan isi pesan tidak dikirim ke Google Analytics; yang dikirim hanya peristiwa bahwa formulir
              telah dikirim beserta nama formulir dan layanan yang dipilih.
            </p>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Log teknis.</strong> Server mencatat data teknis standar seperti waktu akses
              dan halaman yang diminta. Tujuan: menjaga keamanan dan menelusuri gangguan. Dasar pemrosesan:
              kepentingan sah kami atas keamanan layanan.
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Pihak ketiga dan transfer data ke luar Indonesia</h2>
            <p className="text-body text-ink-muted">
              Data statistik kunjungan diproses oleh Google LLC sebagai penyedia Google Analytics dan dapat diproses di
              server di luar Indonesia. Pengiriman data ke luar Indonesia mengikuti Pasal 56 UU No. 27 Tahun 2022
              tentang Pelindungan Data Pribadi, dengan mengacu pada ketentuan pemrosesan data yang berlaku untuk
              layanan Google Analytics. Data yang dikirim ke Google Analytics terbatas pada data statistik yang
              dijelaskan di atas dan tidak memuat nama, email, nomor WhatsApp, maupun isi pesan formulir.
            </p>
            <p className="text-body text-ink-muted">
              Anda bisa menolak pengukuran ini dengan memblokir cookie di pengaturan browser, memakai mode penyamaran,
              atau memasang{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-ink underline underline-offset-4"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              . Memblokir cookie tidak menghalangi Anda membuka halaman situs ini.
            </p>
            <p className="text-body text-ink-muted">
              Kami tidak menjual data pribadi dan tidak membagikannya ke pihak lain di luar penyedia layanan yang
              diperlukan untuk mengoperasikan situs ini, kecuali diwajibkan hukum.
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Berapa lama data disimpan</h2>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Data formulir diskusi.</strong> Disimpan selama diperlukan untuk menindaklanjuti
              permintaan Anda dan keperluan administrasi kerja sama, dan dihapus setelah tidak lagi diperlukan,
              termasuk untuk data yang sudah lama tidak diperbarui, atau saat Anda meminta penghapusan.
            </p>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Data statistik kunjungan.</strong> Mengikuti pengaturan retensi pada properti
              Google Analytics kami, yang dapat diatur pada rentang 2 hingga 14 bulan untuk properti standar. Setelah
              rentang itu, data tingkat pengguna dihapus oleh Google.
            </p>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Log teknis.</strong> Disimpan dalam jangka pendek dan dihapus secara bergulir.
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Hak Anda dan cara mengajukan permintaan</h2>
            <p className="text-body text-ink-muted">
              Anda berhak meminta akses dan salinan data pribadi Anda, meminta koreksi atau pembaruan, meminta
              penghapusan, menarik persetujuan atas pemrosesan yang Anda berikan, dan mengajukan keberatan atas
              pemrosesan yang kami dasarkan pada kepentingan sah.
            </p>
            <p className="text-body text-ink-muted">
              Pengajuan permintaan dilakukan melalui{" "}
              <a href={`mailto:${site.email}`} className="text-cyan-ink underline underline-offset-4">
                {site.email}
              </a>
              {site.whatsappDisplay ? ` atau WhatsApp ${site.whatsappDisplay}` : ""} dengan menyebutkan jenis permintaan
              dan data yang dimaksud. Kami dapat meminta bukti identitas untuk memastikan permintaan berasal dari pemilik
              data, lalu menindaklanjuti dalam waktu yang wajar sesuai ketentuan UU PDP. Permintaan yang tidak dapat kami
              penuhi akan disertai alasan.
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Perubahan kebijakan</h2>
            <p className="text-body text-ink-muted">
              Kebijakan ini dapat diperbarui bila cara kami memproses data berubah, misalnya saat menambah alat
              analitik baru atau mengubah mekanisme persetujuan. Versi terbaru selalu tersedia di halaman ini beserta
              tanggal pembaruannya. Untuk pertanyaan lain, lihat{" "}
              <Link href="/diskusi" className="text-cyan-ink underline underline-offset-4">
                halaman diskusi
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
