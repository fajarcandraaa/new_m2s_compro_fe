# Handoff: status & task yang belum selesai

Dokumen ini untuk melanjutkan pekerjaan di sesi berikutnya. Perbarui setiap kali ada task selesai.

_Terakhir diperbarui: 15 Oktober 2026_

## Konteks singkat
- **Proyek**: redesign company profile Mind2Screen (mindtoscreen.com). Target utama B2B, sekunder B2C. Bahasa Indonesia.
- **Repo**:
  - FE: `fajarcandraaa/new_m2s_compro_fe` (Next.js 15 App Router, React 19, Tailwind 4, TanStack Query, Tiptap, ISR + revalidate tag)
  - BE: `fajarcandraaa/new_m2s_compro_be` (Go 1.24, chi, pgx, goose auto-migration, seed idempotent, JWT cookie)
  - DB: PostgreSQL
- **Desain**: Figma file `is20WupHCNceNrBx0pfS29`. Halaman: Foundations, Brand Assets, Components, Website – Desktop, Website – Mobile, CMS. Semua UI harus sesuai Figma.
- **Kontrak API**: `api/openapi.yaml` di repo BE (salinan di FE `docs/openapi.yaml`). Perubahan kontrak harus disepakati dulu sebelum implementasi.
  - `contract-v1.0` = commit `66acaeb`
  - `contract-v1.1` = commit `b667e04` (penambahan FAQ)
- **Deploy**: Docker lokal, lalu VPS dengan Dokploy (`docker-compose.dokploy.yml` di BE).
- **Panduan SEO/GEO**: `docs/seo-geo-setup.md`.

## Status PR
| Repo | PR | Isi | Status |
|---|---|---|---|
| BE | fajarcandraaa/new_m2s_compro_be#1 | Build awal | Merged |
| FE | fajarcandraaa/new_m2s_compro_fe#1 | Build awal | Merged |
| BE | fajarcandraaa/new_m2s_compro_be#2 | Kontrak v1.1: FAQ layanan & artikel, migrasi `00009_faqs`, seed FAQ | **Open**, perlu review/merge |
| FE | fajarcandraaa/new_m2s_compro_fe#2 | SEO + GEO: JSON-LD, FAQ publik + editor CMS, robots AI, `llms.txt`, OG otomatis, sitemap lastmod, dokumen ini | **Open**, perlu review/merge |

Kedua PR sudah lolos: BE `go test ./...`; FE `lint`, `typecheck`, `build`; E2E lokal.

## Task yang belum selesai

### A. Perlu tindakan user (bukan kode)
- [ ] **Merge PR #2** di kedua repo. Merge BE dulu, karena FE bergantung pada field `faqs`.
- [ ] **Push tag kontrak** dari repo BE (proxy sesi Claude memblokir push tag):
  ```bash
  git fetch origin && git tag contract-v1.0 66acaeb && git tag contract-v1.1 b667e04
  git push origin contract-v1.0 contract-v1.1
  ```
- [ ] **Setujui teks FAQ seed** di BE `docs/content/seed.json` (5 layanan × 5 FAQ). Teks bisa diedit langsung dari CMS. Seed tidak menimpa FAQ yang sudah diisi.
- [ ] **Badge logo bulat**: aset `badge-round` belum masuk Figma karena upload diblokir. Drag manual ke halaman Brand Assets.

### B. Figma (desain)
- [x] Komponen **FAQ Item** (State=Open/Closed, props Question/Answer) di halaman Components.
- [x] Section FAQ di **Detail Layanan — Desktop** dan **Detail Artikel — Desktop**.
- [ ] Section FAQ di **Website – Mobile** (Detail Layanan & Detail Artikel, lebar 390, padding 16–24).
- [ ] **Panel FAQ** di form CMS Layanan dan Artikel (halaman CMS). Acuan implementasi: `src/components/admin/FaqPanel.tsx`.

### C. Kode: lanjutan yang disarankan
- [ ] **Google Analytics 4**: belum terpasang. Langkah dan potongan kodenya ada di `docs/seo-geo-setup.md` §5:
  - `@next/third-parties`
  - env `NEXT_PUBLIC_GA_ID`
  - event `generate_lead` di form `/diskusi`
  - event `contact_whatsapp`
- [ ] **Placeholder `.env.example` disamakan**: `REVALIDATE_SECRET` di BE (`change-me-revalidate-secret`) dan FE (`change-me`) berbeda, sehingga revalidasi lokal gagal (401). Samakan nilainya dan tambahkan komentar "harus sama".
- [ ] **Auto-load `.env` di BE untuk dev** (opsional). Saat ini harus menjalankan `set -a; source .env; set +a` sebelum `go run ./cmd/api`.
- [ ] **Hapus lead** dari CMS (belum ada endpoint/UI).
- [ ] **Content-Security-Policy**: header keamanan dasar sudah ada di `next.config.ts`, tapi CSP belum, karena perlu diuji dengan JSON-LD inline dan Tiptap.
- [ ] **Secret terpisah untuk hash IP** rate-limit/leads (saat ini memakai secret yang ada).

### D. Deploy produksi (Dokploy)
- [ ] Set env produksi sesuai `docs/seo-geo-setup.md` §2, terutama `SITE_URL` dan `REVALIDATE_SECRET` yang sama, `COOKIE_SECURE=true`, dan `JWT_SECRET` ≥ 32 karakter.
- [ ] Verifikasi `TRUSTED_PROXY_HOPS` dari log IP saat deploy pertama (lihat BE `docs/architecture.md`).
- [ ] Volume persisten untuk `UPLOAD_DIR` dan Postgres.
- [ ] Ganti password admin seed setelah login pertama.
- [ ] Jalankan checklist "Sekali setelah deploy" di `docs/seo-geo-setup.md` §7 (GSC, Bing, GA4, Rich Results, Google Business Profile).

## Aturan kerja yang disepakati
- Setiap pekerjaan dikerjakan di **branch baru dari `main`** di masing-masing repo, lalu dibuka **PR ke `main`**.
- Perubahan kontrak API disepakati dulu, lalu diimplementasikan di BE dan FE. Spec BE disalin ke FE `docs/openapi.yaml` dan types di-regenerate.
- UI baru didesain di Figma dulu, atau minimal diselaraskan dengan Figma, sebelum dianggap selesai.
- Admin CMS dibuat sesederhana mungkin.
- Jangan commit secret.

## Cara menjalankan lokal (ringkas)
- **BE**: salin `.env.example` ke `.env` dan isi `DATABASE_URL`, `JWT_SECRET` (≥32), `COOKIE_SECURE=false`, `FRONTEND_URL=http://localhost:3000`, dan `REVALIDATE_SECRET`. Lalu:
  ```bash
  set -a; source .env; set +a; go run ./cmd/api
  ```
- **FE**: buat `.env.local` berisi `BACKEND_URL=http://localhost:8080` dan `REVALIDATE_SECRET` (**sama dengan BE**). Lalu jalankan `npm run dev`.
- Jika halaman publik tidak berubah setelah edit di CMS, cek log BE untuk `revalidate failed` / `non-2xx`, lalu lakukan hard refresh browser.
