import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { CaseStudyCase } from "@/components/site/CaseStudyCase";
import { DiscussPanel } from "@/components/site/DiscussPanel";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { getCaseStudies, getCaseStudy, getSite } from "@/lib/api/public";
import { breadcrumbJsonLd, caseStudyJsonLd, pageMetadata } from "@/lib/seo";
import { siteWhatsappUrl } from "@/lib/site";

// Dirender per request (alasan di src/app/(site)/layout.tsx).
export const dynamic = "force-dynamic";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) return { title: "Studi kasus tidak ditemukan" };
  return pageMetadata({ title: cs.title, description: cs.summary, path: `/studi-kasus/${cs.slug}`, seo: cs.seo, ogImageFile: true });
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

function NumberedList({ items, icon }: { items: string[]; icon?: "x" | "check" }) {
  return (
    <ul className="flex flex-col">
      {items.map((t, i) => (
        <li key={`${i}-${t}`} className={icon ? "flex items-start gap-4 border-t border-line py-4 first:border-t-0 first:pt-0" : "flex gap-5 border-t border-line py-4 first:border-t-0 first:pt-0"}>
          {icon ? (
            <span aria-hidden="true" className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-line text-small text-ink-muted">
              {icon === "x" ? "×" : "✓"}
            </span>
          ) : (
            <span aria-hidden="true" className="w-8 shrink-0 font-mono text-small text-cyan-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
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
      <div className="container-narrow section-block">
        <div className="mb-12 grid overflow-hidden rounded-2xl border border-line lg:mb-14 lg:grid-cols-[7fr_5fr]">
          <div className="flex flex-col justify-center gap-6 bg-surface p-6 lg:p-10">
            <BeforeAfter
              before={cs.initialConditions}
              beforeNote={cs.initialConditionsTitle}
              after={cs.solutions}
              afterNote={cs.impactTitle}
            />
          </div>

          <div
            data-theme="dark"
            className="relative flex flex-col justify-center gap-8 bg-[#080808] p-6 lg:p-10"
            style={{
              backgroundImage: "radial-gradient(#181818 1.6px, transparent 1.8px)",
              backgroundSize: "32px 32px",
            }}
          >
            {cs.scope.length > 0 ? (
              <div className="relative z-[1] flex flex-col gap-3">
                <p className="text-tagline text-ink-muted">Cakupan sistem</p>
                <ul className="flex flex-wrap gap-2">
                  {cs.scope.map((s) => (
                    <li key={s} className="rounded-[4px] border border-cyan px-2.5 py-0.5 text-small text-ink">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          <article className="flex min-w-0 flex-1 flex-col gap-12 lg:max-w-[804px]">
            {cs.risks.length > 0 ? (
              <Block id="risiko" eyebrow="Risiko jika dibiarkan" title={cs.risksTitle}>
                <NumberedList items={cs.risks} icon="x" />
              </Block>
            ) : null}
            {cs.approach.length > 0 ? (
              <Block id="pendekatan" eyebrow="Pendekatan Mind2Screen" title={cs.approachTitle}>
                <NumberedList items={cs.approach} />
              </Block>
            ) : null}
            {cs.impacts.length > 0 ? (
              <Block id="dampak" eyebrow="Dampak bisnis" title={cs.impactTitle}>
                <NumberedList items={cs.impacts} icon="check" />
              </Block>
            ) : null}
            {cs.lesson ? (
              <section aria-labelledby="pelajaran" className="flex flex-col gap-4 rounded-2xl border-2 border-cyan bg-surface p-6 lg:p-8">
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
            <div className="flex flex-col gap-6">
              {others.map((c) => (
                <CaseStudyCase key={c.slug} cs={c} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <JsonLd data={caseStudyJsonLd(cs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Studi Kasus", path: "/studi-kasus" }, { name: cs.title, path: `/studi-kasus/${cs.slug}` }])} />
    </>
  );
}
