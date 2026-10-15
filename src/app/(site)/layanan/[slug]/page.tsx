import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/site/CaseStudyCard";
import { DiscussPanel } from "@/components/site/DiscussPanel";
import { PackageCard } from "@/components/site/PackageCard";
import { PageHero } from "@/components/site/PageHero";
import { Chip } from "@/components/ui/Tag";
import { getCaseStudies, getService, getServices, getSite } from "@/lib/api/public";
import { pageMetadata } from "@/lib/seo";
import { siteWhatsappUrl } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Layanan tidak ditemukan" };
  return pageMetadata({ title: s.title, description: s.summary || s.tagline, path: `/layanan/${s.slug}`, seo: s.seo });
}

export default async function LayananDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, site, caseStudies] = await Promise.all([getService(slug), getSite(), getCaseStudies()]);
  if (!service) notFound();

  const systems = new Set(service.systems.map((x) => x.toLowerCase()));
  const related = caseStudies.filter(
    (c) => systems.has(c.category.toLowerCase()) || c.scope.some((x) => systems.has(x.toLowerCase())),
  );
  const audienceLabel = service.audience === "business" ? "Untuk perusahaan" : "Untuk usaha & personal";

  return (
    <>
      <PageHero eyebrow={`Layanan · ${audienceLabel}`} title={service.title} lead={service.tagline} />
      <div className="container-site py-16 lg:py-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-12">
            {service.audienceText ? (
              <section aria-labelledby="untuk-siapa" className="flex flex-col gap-4">
                <h2 id="untuk-siapa" className="text-heading text-ink">
                  Untuk siapa
                </h2>
                <p className="text-body text-ink-muted">{service.audienceText}</p>
              </section>
            ) : null}

            {service.deliverables.length > 0 ? (
              <section aria-labelledby="dikerjakan" className="flex flex-col gap-4">
                <h2 id="dikerjakan" className="text-heading text-ink">
                  Yang Kami kerjakan
                </h2>
                <ul>
                  {service.deliverables.map((d) => (
                    <li key={d.title} className="flex flex-col gap-2 border-t border-line py-4 first:pt-4 last:pb-0">
                      <h3 className="text-title text-ink">{d.title}</h3>
                      {d.body ? <p className="text-body text-ink-muted">{d.body}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {service.packages.length > 0 ? (
              <section aria-labelledby="paket" className="flex flex-col gap-4">
                <h2 id="paket" className="text-heading text-ink">
                  Paket
                </h2>
                <ul className="grid gap-4 md:grid-cols-2">
                  {service.packages.map((p) => (
                    <li key={p.name}>
                      <PackageCard pkg={p} serviceSlug={service.slug} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {service.systems.length > 0 ? (
              <section aria-labelledby="sistem" className="flex flex-col gap-4">
                <h2 id="sistem" className="text-heading text-ink">
                  Sistem yang sering Kami bangun
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {service.systems.map((x) => (
                    <li key={x}>
                      <Chip>{x}</Chip>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {related.length > 0 ? (
              <section aria-labelledby="terkait" className="flex flex-col gap-4">
                <h2 id="terkait" className="text-heading text-ink">
                  Studi kasus terkait
                </h2>
                <div className="flex flex-col gap-6">
                  {related.slice(0, 2).map((cs) => (
                    <CaseStudyCard key={cs.slug} cs={cs} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
          <div className="lg:w-[380px] lg:shrink-0 lg:self-stretch">
            <DiscussPanel diskusiHref={`/diskusi?layanan=${service.slug}`} whatsappHref={siteWhatsappUrl(site)} />
          </div>
        </div>
      </div>
    </>
  );
}
