import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/site/CaseStudyCard";
import { DiscussPanel } from "@/components/site/DiscussPanel";
import { PageHero } from "@/components/site/PageHero";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Tag";
import { getCaseStudies, getCaseStudy, getSite } from "@/lib/api/public";
import { pageMetadata } from "@/lib/seo";
import { siteWhatsappUrl } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getCaseStudies();
  return items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) return { title: "Studi kasus tidak ditemukan" };
  return pageMetadata({ title: cs.title, description: cs.summary, path: `/studi-kasus/${cs.slug}`, seo: cs.seo });
}

function Block({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <p className="text-tagline text-cyan-ink">{eyebrow}</p>
      {title ? (
        <h2 id={id} className="text-heading text-ink">
          {title}
        </h2>
      ) : (
        <h2 id={id} className="sr-only">
          {eyebrow}
        </h2>
      )}
      {children}
    </section>
  );
}

function MarkedList({ items, marker, markerClass = "text-cyan-ink" }: { items: string[]; marker: (i: number) => string; markerClass?: string }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((t, i) => (
        <li key={`${i}-${t}`} className="flex gap-4">
          <span aria-hidden={marker(i) === "—" || undefined} className={`w-12 shrink-0 text-[14px] leading-[26px] font-medium ${markerClass}`}>
            {marker(i)}
          </span>
          <span className="text-body text-ink">{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function StudiKasusDetailPage({ params }: Props) {
  const { slug } = await params;
  const [cs, site, all] = await Promise.all([getCaseStudy(slug), getSite(), getCaseStudies()]);
  if (!cs) notFound();
  const others = all.filter((c) => c.slug !== cs.slug).slice(0, 2);

  return (
    <>
      <PageHero eyebrow={`Studi kasus · ${cs.systemName} · ${cs.category}`} title={cs.title} lead={cs.summary} />
      <div className="container-site py-16 lg:py-24">
        <Card className="mb-12 flex flex-col gap-6 p-6 md:flex-row md:items-start md:gap-12 lg:mb-14 lg:p-8">
          <dl className="grid grid-cols-2 gap-6 md:flex md:gap-12">
            {cs.metrics.map((m) => (
              <div key={m.label} className="flex flex-col md:w-[180px]">
                <dt className="text-small text-ink-muted">{m.label}</dt>
                <dd className="order-first text-display text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
          {cs.scope.length > 0 ? (
            <div className="flex flex-col gap-2 md:pt-2">
              <p className="text-small text-ink-muted">Cakupan sistem</p>
              <ul className="flex flex-wrap gap-2">
                {cs.scope.map((s) => (
                  <li key={s}>
                    <Chip>{s}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          <article className="flex min-w-0 flex-1 flex-col gap-12 lg:max-w-[804px]">
            {cs.initialConditions.length > 0 ? (
              <Block id="kondisi" eyebrow="Kondisi awal" title={cs.initialConditionsTitle}>
                <MarkedList items={cs.initialConditions} marker={() => "—"} />
              </Block>
            ) : null}
            {cs.risks.length > 0 ? (
              <Block id="risiko" eyebrow="Risiko jika dibiarkan" title={cs.risksTitle}>
                <MarkedList items={cs.risks} marker={() => "Tidak"} markerClass="text-ink-muted" />
              </Block>
            ) : null}
            {cs.approach.length > 0 || cs.solutions.length > 0 ? (
              <Block id="pendekatan" eyebrow="Pendekatan Mind2Screen" title={cs.approachTitle}>
                <MarkedList items={cs.approach} marker={(i) => String(i + 1).padStart(2, "0")} />
                {cs.solutions.length > 0 ? (
                  <div className="mt-4 flex flex-col gap-3">
                    <h3 className="text-title text-ink">Yang Kami bangun</h3>
                    <MarkedList items={cs.solutions} marker={() => "—"} />
                  </div>
                ) : null}
              </Block>
            ) : null}
            {cs.impacts.length > 0 ? (
              <Block id="dampak" eyebrow="Dampak bisnis" title={cs.impactTitle}>
                <MarkedList items={cs.impacts} marker={() => "Ya"} />
              </Block>
            ) : null}
            {cs.lesson ? (
              <section aria-labelledby="pelajaran" className="flex flex-col gap-4 rounded-lg border-2 border-cyan bg-surface p-6 lg:p-8">
                <h2 id="pelajaran" className="text-tagline text-cyan-ink">
                  Pelajaran
                </h2>
                <p className="text-[24px] leading-[32px] font-semibold text-ink">{cs.lesson}</p>
              </section>
            ) : null}
          </article>
          <div className="lg:w-[380px] lg:shrink-0 lg:self-stretch">
            <DiscussPanel
              eyebrow="Punya masalah serupa?"
              title="Kami bisa mulai dari memetakan alur data tim Anda"
              body={null}
              whatsappHref={siteWhatsappUrl(site)}
            />
          </div>
        </div>

        {others.length > 0 ? (
          <section aria-labelledby="lain" className="mt-16 flex flex-col gap-8 lg:mt-24">
            <h2 id="lain" className="text-tagline text-cyan-ink">
              Studi kasus lain
            </h2>
            <ul className="grid gap-6 md:grid-cols-2">
              {others.map((c) => (
                <li key={c.slug}>
                  <CaseStudyCard cs={c} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
