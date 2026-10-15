import type { Site } from "@/lib/api/types";

/** Fallback company info (from docs/content/seed.json) used only when the API is unreachable. */
export const FALLBACK_SITE: Site = {
  companyName: "Mind2Screen",
  legalName: "Mindtoscreen Technology Indonesia",
  tagline: "From Idea to Digital Reality",
  email: "hello@mindtoscreen.com",
  whatsappNumber: "+6282230109923",
  whatsappDisplay: "+62 822-3010-9923",
  whatsappGreeting: "Halo Mind2Screen, saya ingin berdiskusi tentang kebutuhan sistem.",
  address: "Jln. Terusan Segawe 5, Bandungrejosari, Sukun, Malang, Jawa Timur",
  mapsUrl: null,
  linkedinUrl: null,
  instagramUrl: null,
  showTestimonials: false,
  showClientLogos: false,
};

/** https://wa.me/{number without +}?text={greeting} */
export function whatsappUrl(number: string, text?: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function siteWhatsappUrl(site: Pick<Site, "whatsappNumber" | "whatsappGreeting">) {
  return whatsappUrl(site.whatsappNumber, site.whatsappGreeting);
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const NAV = [
  { href: "/layanan", label: "Layanan" },
  { href: "/cara-kerja", label: "Cara Kerja" },
  { href: "/studi-kasus", label: "Studi Kasus" },
  { href: "/artikel", label: "Artikel" },
  { href: "/tentang", label: "Tentang" },
] as const;
