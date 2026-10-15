import type { MetadataRoute } from "next";
import { getArticles, getCaseStudies, getServices } from "@/lib/api/public";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, caseStudies, articles] = await Promise.all([getServices(), getCaseStudies(), getArticles(1, 100)]);
  const now = new Date();
  // Public service/case-study payloads carry no timestamps; articles use publishedAt (no public updatedAt).
  const latestArticle = articles.data.reduce<Date | undefined>((max, a) => {
    const d = new Date(a.publishedAt);
    return !max || d > max ? d : max;
  }, undefined);
  const statics = ["", "/layanan", "/cara-kerja", "/studi-kasus", "/artikel", "/tentang", "/promo", "/diskusi"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: p === "/artikel" && latestArticle ? latestArticle : now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...statics,
    ...services.map((s) => ({ url: `${SITE_URL}/layanan/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...caseStudies.map((c) => ({ url: `${SITE_URL}/studi-kasus/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.data.map((a) => ({
      url: `${SITE_URL}/artikel/${a.slug}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
