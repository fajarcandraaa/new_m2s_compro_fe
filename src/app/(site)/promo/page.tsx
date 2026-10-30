import type { Metadata } from "next";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { PromoList } from "@/components/site/PromoList";
import { Reveal } from "@/components/site/Reveal";
import { getPromos } from "@/lib/api/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Promo",
  description: "Penawaran terbatas untuk layanan Kami. Status dan periode diperbarui otomatis.",
  path: "/promo",
});

export default async function PromoPage() {
  const promos = await getPromos();
  return (
    <>
      <PageHero eyebrow="Promo" title="Promo" lead="Penawaran terbatas untuk layanan Kami. Status dan periode diperbarui otomatis." />
      <section aria-label="Daftar promo" className="container-site py-16 lg:py-24">
        <Reveal>
          <PromoList promos={promos} />
        </Reveal>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Promo", path: "/promo" }])} />
    </>
  );
}
