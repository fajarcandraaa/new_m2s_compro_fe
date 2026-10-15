import type { Metadata } from "next";
import type { Article, CaseStudy, FaqItem, Seo, Service, Site } from "@/lib/api/types";
import { SITE_URL } from "@/lib/site";

/** Site-wide generated OG image (app/opengraph-image.tsx). The static /brand/og-default.png stays as a spare asset. */
export const DEFAULT_OG = "/opengraph-image";
export const DEFAULT_DESCRIPTION =
  "Mind2Screen membangun HRIS, DMS, dan portal internal yang modular dan terdokumentasi untuk bisnis yang ingin tumbuh.";

export const ORG_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
const LANG = "id-ID";

/** Absolute URL for a site-relative path (absolute URLs pass through). */
export const absUrl = (path: string) => new URL(path, `${SITE_URL}/`).toString();

/**
 * Build page metadata from API SEO fields with sensible fallbacks.
 * OG image precedence: seo.ogImageUrl > `image` (e.g. article cover) > generated.
 * "Generated" is the route's own opengraph-image file when `ogImageFile` is set (Next applies the
 * file only when this segment sets no openGraph.images), otherwise the site-wide DEFAULT_OG.
 */
export function pageMetadata(opts: {
  title: string;
  description?: string | null;
  path: string;
  seo?: Seo | null;
  image?: string | null;
  ogImageFile?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const title = opts.seo?.title || opts.title;
  const description = opts.seo?.description || opts.description || DEFAULT_DESCRIPTION;
  const image = opts.seo?.ogImageUrl || opts.image || (opts.ogImageFile ? null : DEFAULT_OG);
  return {
    title,
    description,
    alternates: { canonical: opts.path },
    openGraph: {
      title,
      description,
      url: opts.path,
      siteName: "Mind2Screen",
      locale: "id_ID",
      type: opts.type ?? "website",
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    // Twitter images are filled in from openGraph.images by Next when omitted here.
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD builders (schema.org). Rendered with <JsonLd />; all URLs absolute.
// ---------------------------------------------------------------------------

const orgRef = { "@id": ORG_ID };
const areaServed = { "@type": "Country", name: "Indonesia" };

export function organizationJsonLd(site: Site) {
  const sameAs = [site.linkedinUrl, site.instagramUrl].filter(Boolean);
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.companyName,
    legalName: site.legalName,
    url: SITE_URL,
    logo: absUrl("/brand/icon-512.png"),
    image: absUrl(DEFAULT_OG),
    slogan: site.tagline,
    description: DEFAULT_DESCRIPTION,
    email: site.email,
    telephone: site.whatsappNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Malang",
      addressRegion: "Jawa Timur",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: site.whatsappNumber,
      email: site.email,
      availableLanguage: ["id"],
    },
    areaServed,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(site: Site) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.companyName,
    url: SITE_URL,
    inLanguage: LANG,
    description: DEFAULT_DESCRIPTION,
    publisher: orgRef,
  };
}

/** Organization + WebSite as one graph (site layout). */
export function siteJsonLd(site: Site) {
  return { "@context": "https://schema.org", "@graph": [organizationJsonLd(site), websiteJsonLd(site)] };
}

/** Beranda › … crumbs; `path` is site-relative. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Beranda", path: "/" }, ...items].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

/** "Rp 3.500.000" / "3500000" → 3500000; anything else ("Hubungi Kami", "Rp 3,5 jt") → null. */
export function parseIdrPrice(v: string): number | null {
  const m = /^(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d+)(?:,-|,00)?$/i.exec(v.trim());
  return m ? Number(m[1]!.replace(/\./g, "")) : null;
}

export function serviceJsonLd(s: Service) {
  const url = absUrl(`/layanan/${s.slug}`);
  const offers = s.packages.flatMap((p) => {
    const price = parseIdrPrice(p.priceValue);
    return price === null
      ? []
      : [{ "@type": "Offer", name: p.name, ...(p.description ? { description: p.description } : {}), price, priceCurrency: "IDR", url }];
  });
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: s.title,
    description: s.seo.description || s.summary || s.tagline,
    serviceType: s.eyebrow || s.title,
    url,
    provider: orgRef,
    areaServed,
    audience: { "@type": "BusinessAudience", name: s.audience === "business" ? "Perusahaan" : "Usaha & personal" },
    ...(offers.length ? { offers } : {}),
  };
}

/** A team byline ("Tim Mind2Screen") is the organization, not a person. */
function authorOf(author: string) {
  const a = author.trim();
  return a && !/mind2screen|mindtoscreen/i.test(a) ? { "@type": "Person", name: a } : orgRef;
}

export function blogPostingJsonLd(a: Article) {
  const url = absUrl(`/artikel/${a.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.seo.description || a.excerpt,
    // Generated per-route OG URLs carry a build hash suffix, so the stable site-wide image is the fallback.
    image: absUrl(a.seo.ogImageUrl || a.coverImageUrl || DEFAULT_OG),
    datePublished: a.publishedAt,
    // The public Article payload has no updatedAt; publishedAt is the best available signal.
    dateModified: a.publishedAt,
    author: authorOf(a.author),
    publisher: orgRef,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: LANG,
    ...(a.tags.length ? { keywords: a.tags.map((t) => t.name).join(", ") } : {}),
    ...(a.readMinutes ? { timeRequired: `PT${a.readMinutes}M` } : {}),
  };
}

export function caseStudyJsonLd(cs: CaseStudy) {
  const url = absUrl(`/studi-kasus/${cs.slug}`);
  const keywords = [cs.systemName, cs.category, ...cs.scope].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.seo.description || cs.summary,
    image: absUrl(cs.seo.ogImageUrl || DEFAULT_OG),
    author: orgRef,
    publisher: orgRef,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: LANG,
    articleSection: "Studi Kasus",
    ...(keywords.length ? { keywords: [...new Set(keywords)].join(", ") } : {}),
  };
}

/** FAQPage, or null when there are no FAQs. */
export function faqJsonLd(faqs: FaqItem[] | undefined) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
