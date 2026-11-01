import type { Metadata } from "next";
import Link from "next/link";
import { Anim } from "@/components/site/Anim";
import { BandCta } from "@/components/site/BandCta";
import { CaseStudyFilter } from "@/components/site/CaseStudyFilter";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { getCaseStudies } from "@/lib/api/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Studi Kasus",
  description:
    "Bagaimana Mind2Screen membantu perusahaan merapikan sistem internal, mengurangi risiko operasional, dan meningkatkan kontrol manajemen.",
  path: "/studi-kasus",
});

export default async function StudiKasusPage() {
  const items = await getCaseStudies();
  return (
    <>
      <PageHero
        eyebrow="Studi Kasus"
        title="Studi Kasus"
        lead="Bagaimana Mind2Screen membantu perusahaan merapikan sistem internal, mengurangi risiko operasional, dan meningkatkan kontrol manajemen."
      />
      <section aria-label="Daftar studi kasus" className="section-block">
        <div className="container-narrow">
          <Anim>
            <CaseStudyFilter items={items} />
          </Anim>
        </div>
      </section>
      <BandCta
        id="ajakan-studi-kasus"
        eyebrow="Situasi serupa?"
        title="Punya situasi yang mirip?"
        body="Ceritakan kondisinya. Kami petakan akar masalahnya sebelum bicara solusi."
      >
        <Link
          href="/diskusi"
          className="inline-flex min-h-12 items-center rounded-md bg-[#080808] px-6 font-medium text-white transition-colors hover:bg-[#181818]"
        >
          Diskusi Kebutuhan Sistem
        </Link>
      </BandCta>
      <JsonLd data={breadcrumbJsonLd([{ name: "Studi Kasus", path: "/studi-kasus" }])} />
    </>
  );
}
