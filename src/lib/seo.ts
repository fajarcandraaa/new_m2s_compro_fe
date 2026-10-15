import type { Metadata } from "next";
import type { Seo, Site } from "@/lib/api/types";
import { SITE_URL } from "@/lib/site";

export const DEFAULT_OG = "/brand/og-default.png";
export const DEFAULT_DESCRIPTION =
  "Mind2Screen membangun HRIS, DMS, dan portal internal yang modular dan terdokumentasi untuk bisnis yang ingin tumbuh.";

/** Build page metadata from API SEO fields with sensible fallbacks. */
export function pageMetadata(opts: {
  title: string;
  description?: string | null;
  path: string;
  seo?: Seo | null;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const title = opts.seo?.title || opts.title;
  const description = opts.seo?.description || opts.description || DEFAULT_DESCRIPTION;
  const image = opts.seo?.ogImageUrl || opts.image || DEFAULT_OG;
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
      images: [{ url: image, width: 1200, height: 630 }],
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function organizationJsonLd(site: Site) {
  const sameAs = [site.linkedinUrl, site.instagramUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.companyName,
    legalName: site.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/icon-512.png`,
    slogan: site.tagline,
    email: site.email,
    telephone: site.whatsappNumber,
    address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: "Malang", addressCountry: "ID" },
    ...(sameAs.length ? { sameAs } : {}),
  };
}
