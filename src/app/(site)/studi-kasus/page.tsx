import type { Metadata } from "next";
import { CaseStudyFilter } from "@/components/site/CaseStudyFilter";
import { CtaStrip } from "@/components/site/CtaStrip";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { getCaseStudies } from "@/lib/api/public";
import { pageMetadata } from "@/lib/seo";

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
      <section aria-label="Daftar studi kasus" className="container-site py-16 lg:py-24">
        <Reveal className="flex flex-col gap-12">
          <CaseStudyFilter items={items} />
          <CtaStrip title="Punya situasi yang mirip?" body="Ceritakan kondisinya. Kami petakan akar masalahnya sebelum bicara solusi." />
        </Reveal>
      </section>
    </>
  );
}
