import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/site/ArticleCard";
import { ArticleCover } from "@/components/site/ArticleCover";
import { Faq } from "@/components/site/Faq";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { ShareLinks } from "@/components/site/ShareLinks";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Tag";
import { getArticle, getArticles, getRelatedArticles } from "@/lib/api/public";
import { formatDate } from "@/lib/format";
import { blogPostingJsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const list = await getArticles(1, 100);
  return list.data.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Artikel tidak ditemukan" };
  return pageMetadata({
    title: a.title,
    description: a.excerpt,
    path: `/artikel/${a.slug}`,
    seo: a.seo,
    image: a.coverImageUrl,
    ogImageFile: true,
    type: "article",
    publishedTime: a.publishedAt,
  });
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;
  const [article, related] = await Promise.all([getArticle(slug), getRelatedArticles(slug, 3)]);
  if (!article) notFound();

  const url = `${SITE_URL}/artikel/${article.slug}`;
  const isSystems = article.tags.some((t) => t.slug === "sistem-internal");

  return (
    <>
      <PageHero
        eyebrow={`Artikel${article.tags[0] ? ` · ${article.tags[0].name}` : ""}`}
        title={article.title}
        lead={
          <>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.readMinutes} menit baca
            {article.author ? ` · ${article.author}` : ""}
          </>
        }
      />
      <article className="container-site py-12 lg:py-16">
        <div className="mx-auto flex max-w-[720px] flex-col gap-8">
          <ArticleCover src={article.coverImageUrl} alt={article.title} priority sizes="(min-width: 768px) 720px, 100vw" />
          {/* contentHtml is sanitised by the BE (bluemonday UGC policy) before it is stored. */}
          <div className="prose-m2s" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
          <Faq items={article.faqs} className="mt-4" />
          {article.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label="Tag">
              {article.tags.map((t) => (
                <li key={t.slug}>
                  <a href={`/artikel?tag=${t.slug}`}>
                    <Chip className="hover:border-cyan">{t.name}</Chip>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <ShareLinks url={url} title={article.title} />
          <aside className="flex flex-col items-start gap-4 rounded-lg border border-line bg-surface p-6 lg:p-8">
            {isSystems ? (
              <>
                <h2 className="text-title text-ink">Butuh sistem internal yang benar-benar dipakai?</h2>
                <p className="text-small text-ink-muted">Kami mulai dari memahami cara kerja tim Anda, bukan langsung menulis kode.</p>
                <Button href="/diskusi" variant="secondary">
                  Diskusi Kebutuhan Sistem
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-title text-ink">Butuh website yang benar-benar bekerja?</h2>
                <p className="text-small text-ink-muted">Kami bantu dari menentukan tujuan dan alur pengunjung, sampai website siap dipakai.</p>
                <Button href="/layanan#web-development" variant="secondary">
                  Lihat Paket Website
                </Button>
              </>
            )}
          </aside>
        </div>
      </article>
      {related.length > 0 ? (
        <section aria-labelledby="terkait" className="container-site pb-16 lg:pb-24">
          <h2 id="terkait" className="text-tagline text-cyan-ink">
            Artikel terkait
          </h2>
          <ul className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <JsonLd data={blogPostingJsonLd(article)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Artikel", path: "/artikel" }, { name: article.title, path: `/artikel/${article.slug}` }])} />
      <JsonLd data={faqJsonLd(article.faqs)} />
    </>
  );
}
