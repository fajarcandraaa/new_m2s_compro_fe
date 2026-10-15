/** Typed public data loaders used by the public pages. */
import { cache } from "react";
import { FALLBACK_SITE } from "@/lib/site";
import type { Site } from "./types";
import { serverClient as c, settle, tagged } from "./server";

export const getSite = cache(async (): Promise<Site> => {
  const r = await settle(c.GET("/site", { fetch: tagged(["site"]) }));
  return r?.data ?? FALLBACK_SITE;
});

export const getServices = cache(async (audience?: "business" | "personal") => {
  const r = await settle(c.GET("/services", { params: { query: audience ? { audience } : {} }, fetch: tagged(["services"]) }));
  return r?.data ?? [];
});

export const getService = cache(async (slug: string) => {
  const r = await settle(c.GET("/services/{slug}", { params: { path: { slug } }, fetch: tagged(["services"]) }));
  return r?.data ?? null;
});

export const getCaseStudies = cache(async (featured?: boolean) => {
  const r = await settle(
    c.GET("/case-studies", { params: { query: featured ? { featured: true } : {} }, fetch: tagged(["case-studies"]) }),
  );
  return r?.data ?? [];
});

export const getCaseStudy = cache(async (slug: string) => {
  const r = await settle(c.GET("/case-studies/{slug}", { params: { path: { slug } }, fetch: tagged(["case-studies"]) }));
  return r?.data ?? null;
});

export const getArticles = cache(async (page = 1, pageSize = 9, tag?: string) => {
  const r = await settle(
    c.GET("/articles", { params: { query: { page, pageSize, ...(tag ? { tag } : {}) } }, fetch: tagged(["articles"]) }),
  );
  return r ?? { data: [], meta: { page, pageSize, total: 0 } };
});

export const getArticle = cache(async (slug: string) => {
  const r = await settle(c.GET("/articles/{slug}", { params: { path: { slug } }, fetch: tagged(["articles"]) }));
  return r?.data ?? null;
});

export const getRelatedArticles = cache(async (slug: string, limit = 3) => {
  const r = await settle(
    c.GET("/articles/{slug}/related", { params: { path: { slug }, query: { limit } }, fetch: tagged(["articles"]) }),
  );
  return r?.data ?? [];
});

export const getTags = cache(async () => {
  const r = await settle(c.GET("/tags", { fetch: tagged(["articles"]) }));
  return r?.data ?? [];
});

export const getPromos = cache(async (status?: "active" | "upcoming" | "ended") => {
  const r = await settle(c.GET("/promos", { params: { query: status ? { status } : {} }, fetch: tagged(["promos"]) }));
  return r?.data ?? [];
});

export const getTestimonials = cache(async (limit = 3) => {
  const r = await settle(c.GET("/testimonials", { params: { query: { limit } }, fetch: tagged(["testimonials"]) }));
  return r?.data ?? [];
});

export const getClientLogos = cache(async () => {
  const r = await settle(c.GET("/client-logos", { fetch: tagged(["client-logos"]) }));
  return r?.data ?? [];
});
