import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getSite } from "@/lib/api/public";
import { organizationJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <>
      <a
        href="#konten"
        className="sr-only z-[60] rounded-md bg-cyan px-4 py-2 text-on-cyan focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Lewati ke konten
      </a>
      <Header />
      <main id="konten">{children}</main>
      <Footer site={site} />
      <script
        type="application/ld+json"
        // JSON-LD from trusted settings; `<` escaped to keep the script block safe.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(site)).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
