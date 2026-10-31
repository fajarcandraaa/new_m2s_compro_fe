import type { MetadataRoute } from "next";
import { getArticles, getCaseStudies, getServices } from "@/lib/api/public";
import { SITE_URL } from "@/lib/site";

// Sitemap jarang berubah; BE sudah memicu revalidateTag saat konten disimpan.
export const revalidate = 3600;

// BE membatasi pageSize maksimum 100 (internal/httpx/query.go:63).
const PAGE_SIZE = 100;

/** Semua artikel published, diambil per halaman sampai meta.total terpenuhi. */
async function allArticles() {
  const first = await getArticles(1, PAGE_SIZE);
  const pages = Math.ceil(first.meta.total / PAGE_SIZE);
  if (pages <= 1) return first.data;
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => getArticles(i + 2, PAGE_SIZE)),
  );
  return [...first.data, ...rest.flatMap((r) => r.data)];
}

const lastMod = (updatedAt?: string, fallback?: string) => {
  const v = updatedAt || fallback;
  return v ? new Date(v) : undefined;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, caseStudies, articles] = await Promise.all([getServices(), getCaseStudies(), allArticles()]);

  const statics = ["", "/layanan", "/cara-kerja", "/studi-kasus", "/artikel", "/tentang", "/promo", "/diskusi"].map(
    (p) => ({
      url: `${SITE_URL}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
    }),
  );

  return [
    ...statics,
    ...services.map((s) => ({
      url: `${SITE_URL}/layanan/${s.slug}`,
      lastModified: lastMod(s.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...caseStudies.map((c) => ({
      url: `${SITE_URL}/studi-kasus/${c.slug}`,
      lastModified: lastMod(c.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${SITE_URL}/artikel/${a.slug}`,
      lastModified: lastMod(a.updatedAt, a.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
