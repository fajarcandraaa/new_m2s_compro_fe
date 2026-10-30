# Panduan Setup & Optimasi SEO + GEO

Panduan untuk situs Mind2Screen setelah deploy ke produksi.

- **SEO** membuat situs mudah ditemukan di Google dan Bing.
- **GEO** (Generative Engine Optimization) membuat konten mudah dipahami dan dikutip oleh mesin AI seperti ChatGPT, Perplexity, Google AI Overview, dan Claude.

## 1. Yang sudah otomatis di situs

| Fitur | Lokasi | Keterangan |
|---|---|---|
| Meta title, description, canonical | Setiap halaman | Diambil dari field SEO di CMS. Jika kosong, memakai judul/ringkasan konten. |
| Open Graph image | `/…/opengraph-image` | Dibuat otomatis (1200×630). Prioritas: OG dari CMS, lalu cover, lalu gambar otomatis. |
| Data terstruktur (JSON-LD) | HTML setiap halaman | Organization + ProfessionalService, WebSite, BreadcrumbList, Service, BlogPosting/Article, dan FAQPage jika ada FAQ. |
| Sitemap | `/sitemap.xml` | Otomatis bertambah saat konten diterbitkan. |
| Robots | `/robots.txt` | Mesin pencari dan crawler AI (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, dll.) diizinkan; `/admin` dan `/api/` diblokir. |
| llms.txt | `/llms.txt` | Ringkasan bisnis, kontak, layanan, studi kasus, dan artikel dalam format yang mudah dibaca AI. |
| FAQ | Detail layanan & artikel | Diisi dari CMS, tampil sebagai "Pertanyaan umum" + JSON-LD FAQPage. |

Semua di atas ikut diperbarui otomatis saat konten diubah dari CMS. Syaratnya adalah env pada langkah 2.

## 2. Env produksi (wajib benar)

**Frontend:**
```
SITE_URL=https://mindtoscreen.com
NEXT_PUBLIC_SITE_URL=https://mindtoscreen.com
REVALIDATE_SECRET=<rahasia-acak-panjang>
```

**Backend:**
```
SITE_URL=https://mindtoscreen.com
FRONTEND_URL=http://fe:3000          # alamat FE dari dalam jaringan Docker/Dokploy
REVALIDATE_SECRET=<sama persis dengan FE>
```

Cek setelah deploy:
- Buka `https://mindtoscreen.com/robots.txt` dan `/sitemap.xml`. Semua URL harus memakai domain produksi, bukan `localhost`.
- Ubah satu artikel di CMS. Halaman publik harus langsung berubah, dan tidak ada log `revalidate failed` di BE.

## 3. Google Search Console (GSC)

1. Buka https://search.google.com/search-console, lalu klik **Add property** → **Domain** → isi `mindtoscreen.com`.
2. Salin record **TXT** yang diberikan, tambahkan di DNS domain (Cloudflare/registrar), lalu klik **Verify**. Propagasi DNS bisa memakan waktu hingga beberapa jam.
3. Buka menu **Sitemaps**, isi `sitemap.xml`, lalu **Submit**.
4. Di **URL Inspection**, tempel URL beranda lalu klik **Request indexing**. Ulangi untuk 3–5 halaman penting (layanan, studi kasus).
5. Validasi data terstruktur di https://search.google.com/test/rich-results untuk satu halaman layanan dan satu artikel. FAQ dan Breadcrumb harus terdeteksi tanpa error.
6. Pantau secara rutin:
   - **Pages**: halaman yang belum terindeks dan alasannya
   - **Performance**: kata kunci, klik, CTR, posisi
   - **Enhancements**: error data terstruktur

## 4. Bing Webmaster Tools

1. Buka https://www.bing.com/webmasters, lalu pilih **Import from Google Search Console**. Situs dan sitemap otomatis ikut.
2. Ini penting untuk GEO, karena ChatGPT Search dan Copilot memakai indeks Bing.

## 5. Google Analytics 4 (GA4)

### 5.1 Buat property
1. Buka https://analytics.google.com, lalu **Admin** → **Create property** → isi `Mind2Screen`, zona waktu **Asia/Jakarta**, mata uang **IDR**.
2. Buat **Data stream** → **Web**: `https://mindtoscreen.com`. Salin **Measurement ID** (`G-XXXXXXXXXX`).

### 5.2 Pasang di situs (perubahan kode kecil)
GA belum terpasang di kode. Cara yang disarankan:

```bash
npm i @next/third-parties
```

`src/app/layout.tsx`:
```tsx
import { GoogleAnalytics } from "@next/third-parties/google";
// ... di dalam <html>, setelah <body>…</body>:
{process.env.NEXT_PUBLIC_GA_ID ? <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} /> : null}
```

Tambahkan env FE `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`, lalu build ulang (variabel `NEXT_PUBLIC_*` dibaca saat build).

> Jangan memasang GA di `/admin`. Komponen di atas cukup diletakkan di layout situs publik `src/app/(site)/layout.tsx` jika ingin admin tidak ikut terlacak.

### 5.3 Konversi utama: brief dari form Diskusi
Di handler sukses form `/diskusi`:
```ts
import { sendGAEvent } from "@next/third-parties/google";
sendGAEvent("event", "generate_lead", { form: "diskusi", service: selectedServiceSlug });
```
Lalu di GA4: **Admin** → **Events**, tandai `generate_lead` sebagai **Key event**. Klik tombol WhatsApp juga bisa dilacak dengan event `contact_whatsapp`.

### 5.4 Hubungkan GA4 dengan GSC
Di GA4: **Admin** → **Product links** → **Search Console links** → **Link**, lalu pilih property GSC tadi. Laporan kata kunci organik akan muncul di GA4 (Reports → Search Console).

### 5.5 Privasi
Tambahkan kalimat di halaman Tentang atau footer bahwa situs memakai Google Analytics untuk statistik kunjungan. Ini sejalan dengan UU PDP.

## 6. Optimasi konten dari CMS

**SEO:**
- **Judul SEO** ≤ 60 karakter, memuat kata kunci utama di depan. Contoh: "Jasa Pembuatan HRIS Custom untuk Perusahaan | Mind2Screen".
- **Deskripsi SEO** 140–160 karakter, berisi manfaat dan ajakan.
- **Slug** pendek dan deskriptif. Jangan ubah slug halaman yang sudah terindeks.
- **Gambar**: unggah cover 16:9 dengan nama file deskriptif. Teks alternatif diisi dari judul.
- **Tautan internal**: artikel menautkan ke layanan dan studi kasus yang relevan.

**GEO (agar dikutip AI):**
- **Ringkasan 2–3 kalimat di paragraf pertama** artikel yang langsung menjawab inti topik.
- **FAQ** di setiap layanan dan artikel penting: pertanyaan nyata dari klien, jawaban 2–4 kalimat yang berdiri sendiri.
- **Angka konkret** di studi kasus (waktu proses, persentase efisiensi) dan sebut sumber/konteksnya.
- **Konsisten menyebut entitas**: "Mind2Screen (Mindtoscreen Technology Indonesia), Malang".
- **Perbarui konten lama**. Tanggal "diperbarui" ikut terbaca mesin pencari dan AI.

**Entitas & lokal:**
- Buat/klaim **Google Business Profile** dengan nama, alamat, dan nomor WhatsApp yang **sama persis** dengan Info Perusahaan di CMS.
- Isi **LinkedIn** dan **Instagram** di CMS → Info Perusahaan supaya tercantum sebagai `sameAs` di data terstruktur.
- Minta klien meninggalkan ulasan di Google Business Profile.

## 7. Checklist

**Sekali setelah deploy:**
- [ ] Env produksi benar (langkah 2), dan robots/sitemap memakai domain produksi
- [ ] GSC terverifikasi dan sitemap ter-submit
- [ ] Bing Webmaster diimpor dari GSC
- [ ] GA4 terpasang, event `generate_lead` jadi key event, dan GA4 terhubung ke GSC
- [ ] Rich Results Test lolos (layanan + artikel)
- [ ] Google Business Profile dibuat dan NAP sama dengan CMS

**Bulanan:**
- [ ] GSC → Pages: perbaiki halaman yang tidak terindeks
- [ ] GSC → Performance: cari kata kunci dengan tayangan tinggi tapi CTR rendah, lalu perbaiki judul/deskripsi SEO-nya
- [ ] GA4: lihat halaman dengan konversi `generate_lead` terbanyak dan perkuat topiknya
- [ ] Terbitkan minimal 2 artikel dengan ringkasan awal + FAQ
- [ ] Perbarui 1 artikel/studi kasus lama
- [ ] Uji kutipan AI: tanyakan "jasa pembuatan HRIS di Malang" ke ChatGPT/Perplexity, lalu catat apakah Mind2Screen disebut
