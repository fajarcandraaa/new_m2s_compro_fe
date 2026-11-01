import { getArticles, getCaseStudies, getServices, getSite } from "@/lib/api/public";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/**
 * GET /llms.txt (https://llmstxt.org): a markdown map of the site for AI assistants and answer engines.
 * Uses the same tagged loaders as the pages, so CMS revalidation (services, case-studies, articles, site)
 * refreshes it too; when the BE is unreachable during `next build` the loaders fall back (site defaults,
 * empty lists) and ISR regenerates it at runtime.
 */
export const revalidate = 300;

/** One line, no markdown-breaking characters. */
const clean = (s: string) => s.replace(/\s+/g, " ").replace(/[[\]]/g, "").trim();
const link = (name: string, path: string, summary?: string) =>
  `- [${clean(name)}](${SITE_URL}${path})${summary && clean(summary) ? `: ${clean(summary)}` : ""}`;

const PAGES: { name: string; path: string; summary: string }[] = [
  { name: "Tentang Kami", path: "/tentang", summary: "Profil Mind2Screen, nilai, dan cara kami bekerja (Malang, sejak Januari 2024)." },
  { name: "Cara Kerja", path: "/cara-kerja", summary: "Empat tahap kerja: Discovery & Alignment, System Blueprint, Modular Implementation, Stabilization & Growth." },
  { name: "Diskusi Kebutuhan", path: "/diskusi", summary: "Formulir brief singkat untuk menjadwalkan sesi diskusi dengan tim Mind2Screen." },
  { name: "Promo", path: "/promo", summary: "Penawaran terbatas untuk layanan Mind2Screen beserta periodenya." },
];

export async function GET() {
  const [site, services, caseStudies, articles] = await Promise.all([getSite(), getServices(), getCaseStudies(), getArticles(1, 20)]);

  const out: string[] = [
    `# ${site.companyName}`,
    "",
    `> ${clean(`${site.companyName} (${site.legalName}): ${site.tagline}. ${DEFAULT_DESCRIPTION} Berbasis di Malang, Jawa Timur, melayani klien di seluruh Indonesia.`)}`,
    "",
    "Situs dalam Bahasa Indonesia. Mind2Screen adalah partner pengembangan sistem internal B2B (HRIS, DMS, portal internal) dan website untuk usaha, dengan pendekatan yang dimulai dari memahami cara kerja tim klien.",
    "",
    "## Kontak",
    "",
    `- Email: ${site.email}`,
    `- WhatsApp: ${site.whatsappDisplay}`,
    `- Alamat: ${clean(site.address)}`,
    `- Diskusi kebutuhan: ${SITE_URL}/diskusi`,
    "",
    "## Layanan",
    "",
    ...(services.length ? services.map((s) => link(s.title, `/layanan/${s.slug}`, s.summary || s.tagline)) : [link("Layanan Kami", "/layanan")]),
    "",
    "## Studi Kasus",
    "",
    ...(caseStudies.length
      ? caseStudies.map((c) => link(`${c.systemName}: ${c.title}`, `/studi-kasus/${c.slug}`, c.summary))
      : [link("Studi Kasus", "/studi-kasus")]),
    "",
    "## Artikel",
    "",
    ...(articles.data.length ? articles.data.map((a) => link(a.title, `/artikel/${a.slug}`, a.excerpt)) : [link("Artikel", "/artikel")]),
    "",
    "## Halaman",
    "",
    ...PAGES.map((p) => link(p.name, p.path, p.summary)),
    "",
  ];

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
