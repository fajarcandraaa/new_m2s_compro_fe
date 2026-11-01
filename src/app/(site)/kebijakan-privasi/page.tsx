import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { getSite } from "@/lib/api/public";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kebijakan Privasi",
  description:
    "Data apa yang kami kumpulkan saat Anda mengunjungi situs ini, mengapa kami mengumpulkannya, dengan siapa data dibagikan, dan cara meminta akses atau penghapusan.",
  path: "/kebijakan-privasi",
});

/** Tanggal berlaku terakhir. Perbarui manual setiap isi kebijakan berubah. */
const UPDATED_AT = "1 November 2026";

export default async function KebijakanPrivasiPage() {
  const site = await getSite();

  return (
    <>
      <PageHero
        eyebrow="Privasi"
        title="Kebijakan Privasi"
        lead={`Halaman ini menjelaskan data apa yang kami kumpulkan saat Anda memakai situs ini dan apa yang kami lakukan dengan data tersebut. Terakhir diperbarui ${UPDATED_AT}.`}
      />

      <section className="section-block">
        <div className="container-narrow flex flex-col gap-10">
          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Data yang kami kumpulkan</h2>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Statistik kunjungan.</strong> Situs ini memakai Google Analytics 4 untuk
              melihat halaman mana yang dibuka dan bagaimana pengunjung menemukannya. Google Analytics menyimpan cookie
              (misalnya <code className="text-ink">_ga</code>) berisi ID pengunjung acak, lalu mencatat halaman yang
              dibuka, jenis perangkat dan browser secara umum, serta alamat situs perujuk. Google Analytics 4 tidak
              menyimpan alamat IP Anda.
            </p>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Formulir diskusi.</strong> Saat Anda mengirim formulir, kami menyimpan nama,
              email, nomor WhatsApp, nama perusahaan (opsional), layanan yang diminati, perkiraan waktu mulai, dan isi
              pesan. Data ini dipakai untuk menindaklanjuti permintaan Anda. Isian formulir tidak dikirim ke Google
              Analytics.
            </p>
            <p className="text-body text-ink-muted">
              <strong className="text-ink">Log teknis.</strong> Server mencatat data teknis standar seperti waktu akses
              dan halaman yang diminta. Log ini dipakai untuk menjaga keamanan dan menelusuri gangguan, bukan untuk
              memprofilkan pengunjung.
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Dasar pemrosesan</h2>
            <p className="text-body text-ink-muted">
              Kami memproses data sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Isi formulir diproses
              berdasarkan persetujuan Anda saat mengirimkannya. Statistik kunjungan dan log teknis diproses berdasarkan
              kepentingan sah kami untuk memahami pemakaian situs dan menjaga keamanannya.
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Pihak ketiga dan transfer data</h2>
            <p className="text-body text-ink-muted">
              Data statistik kunjungan diproses oleh Google LLC sebagai penyedia Google Analytics, dan dapat diproses di
              server di luar Indonesia. Anda bisa menolak pengukuran ini dengan memblokir cookie di pengaturan browser,
              memakai mode penyamaran, atau memasang{" "}
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
              Data formulir disimpan selama diperlukan untuk menindaklanjuti permintaan Anda dan keperluan administrasi
              kerja sama. Data statistik kunjungan mengikuti masa retensi properti Google Analytics kami. Log teknis
              disimpan dalam jangka pendek dan dihapus secara bergulir.
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Hak Anda</h2>
            <p className="text-body text-ink-muted">
              Anda berhak meminta akses, salinan, koreksi, atau penghapusan data pribadi Anda, serta menarik persetujuan
              atas pemrosesan yang Anda berikan. Kirimkan permintaan ke{" "}
              <a href={`mailto:${site.email}`} className="text-cyan-ink underline underline-offset-4">
                {site.email}
              </a>
              {site.whatsappDisplay ? ` atau WhatsApp ${site.whatsappDisplay}` : ""}. Kami akan menindaklanjuti dalam
              waktu yang wajar dan dapat meminta bukti identitas untuk melindungi data Anda.
            </p>
          </div>

          <div className="flex max-w-[720px] flex-col gap-4">
            <h2 className="text-heading text-ink">Perubahan kebijakan</h2>
            <p className="text-body text-ink-muted">
              Kebijakan ini dapat diperbarui bila cara kami memproses data berubah, misalnya saat menambah alat
              analitik baru. Versi terbaru selalu tersedia di halaman ini beserta tanggal pembaruannya. Untuk
              pertanyaan lain, lihat{" "}
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
