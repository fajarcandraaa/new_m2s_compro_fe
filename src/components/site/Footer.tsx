import Image from "next/image";
import Link from "next/link";
import type { Site } from "@/lib/api/types";
import { whatsappUrl } from "@/lib/site";

const EXPLORE = [
  { href: "/layanan", label: "Layanan" },
  { href: "/cara-kerja", label: "Cara Kerja" },
  { href: "/studi-kasus", label: "Studi Kasus" },
  { href: "/artikel", label: "Artikel" },
  { href: "/promo", label: "Promo" },
];
const COMPANY = [
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/diskusi", label: "Diskusi Kebutuhan" },
];

/** Footer (Figma "Footer"): dark; email, WhatsApp, address from CMS > Info Perusahaan. */
export function Footer({ site }: { site: Site }) {
  const year = new Date().getFullYear();
  const wa = whatsappUrl(site.whatsappNumber, site.whatsappGreeting);
  return (
    <footer data-theme="dark" className="border-t border-line bg-ground lg:border-t-0">
      <div className="container-site flex flex-col gap-8 pt-12 pb-8 lg:gap-16 lg:pt-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6">
            <Link href="/" className="relative block h-[30px] w-[168px] lg:h-10 lg:w-[224px]" aria-label="Mind2Screen, ke beranda">
              <Image src="/brand/lockup-horizontal-white.png" alt="Mind2Screen" fill sizes="224px" className="object-contain object-left" />
            </Link>
            <p className="hidden w-[320px] text-small text-ink-muted lg:block">
              Partner sistem internal untuk perusahaan yang ingin tumbuh tanpa kehilangan kendali.
            </p>
          </div>

          {/* Mobile: single wrapped link row (Figma mobile footer) */}
          <nav aria-label="Tautan footer" className="lg:hidden">
            <ul className="flex flex-wrap gap-x-6 gap-y-4 text-small text-ink">
              {[...EXPLORE, COMPANY[0]!].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-cyan-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-20">
            <nav aria-label="Jelajahi" className="hidden lg:block">
              <p className="text-tagline text-ink-muted">Jelajahi</p>
              <ul className="mt-4 flex flex-col gap-4 text-small text-ink">
                {EXPLORE.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-cyan-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Perusahaan" className="hidden lg:block">
              <p className="text-tagline text-ink-muted">Perusahaan</p>
              <ul className="mt-4 flex flex-col gap-4 text-small text-ink">
                {COMPANY.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-cyan-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="hidden text-tagline text-ink-muted lg:block">Kontak</p>
              <address className="flex flex-col gap-2 text-small not-italic lg:mt-4 lg:gap-4">
                <a href={`mailto:${site.email}`} className="text-ink hover:text-cyan-ink">
                  {site.email}
                </a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-cyan-ink">
                  WhatsApp {site.whatsappDisplay}
                </a>
                {site.mapsUrl ? (
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-cyan-ink lg:w-[240px]">
                    {site.address}
                  </a>
                ) : (
                  <span className="text-ink-muted lg:w-[240px]">{site.address}</span>
                )}
                {site.linkedinUrl || site.instagramUrl ? (
                  <span className="flex gap-4">
                    {site.linkedinUrl ? (
                      <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-cyan-ink">
                        LinkedIn
                      </a>
                    ) : null}
                    {site.instagramUrl ? (
                      <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-cyan-ink">
                        Instagram
                      </a>
                    ) : null}
                  </span>
                ) : null}
              </address>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-small text-ink-muted lg:flex-row lg:justify-between lg:border-t lg:border-line lg:pt-6">
          <div className="flex flex-col gap-1">
            <p>
              © {year} {site.legalName}
            </p>
            <p>
              <Link href="/kebijakan-privasi" className="hover:text-cyan-ink">
                Kebijakan Privasi
              </Link>
            </p>
          </div>
          <p className="hidden text-tagline lg:block">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
