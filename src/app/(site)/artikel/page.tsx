import type { Metadata } from "next";
import Link from "next/link";
import { Anim } from "@/components/site/Anim";
import { ArticleCover } from "@/components/site/ArticleCover";
import { ArrowIcon, StarIcon } from "@/components/site/Icons";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { Pagination } from "@/components/site/Pagination";
import { FilterLink } from "@/components/ui/Filter";
import { getArticles, getTags } from "@/lib/api/public";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

/*
 * This page reads ?tag= and ?page=, so Next renders it on demand. The underlying
 * API fetches still go through the tagged Data Cache (revalidate 300 + on-demand
 * revalidation), so the BE is not hit on every request.
 */
const PAGE_SIZE = 9;

type Props = { searchParams: Promise<{ tag?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { tag, page } = await searchParams;
  const base = pageMetadata({
    title: "Artikel",
    description: "Catatan kami tentang sistem internal, keamanan data, dan cara memakai teknologi dengan lebih bijak.",
    path: "/artikel",
  });
  // Filtered/paginated variants point their canonical at the main list.
  return tag || (page && page !== "1") ? { ...base, robots: { index: false, follow: true } } : base;
}

export default async function ArtikelPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tag = typeof sp.tag === "string" && /^[a-z0-9-]{1,120}$/.test(sp.tag) ? sp.tag : undefined;
  const page = Math.max(1, Math.min(1000, Number.parseInt(sp.page ?? "1", 10) || 1));
  const [list, tags] = await Promise.all([getArticles(page, PAGE_SIZE, tag), getTags()]);
  const totalPages = Math.max(1, Math.ceil(list.meta.total / PAGE_SIZE));
  const [featured, ...rest] = page === 1 ? list.data : [undefined, ...list.data];

  const hrefFor = (p: number) => {
    const q = new URLSearchParams();
    if (tag) q.set("tag", tag);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return s ? `/artikel?${s}` : "/artikel";
  };

  return (
    <>
      <PageHero
        eyebrow="Artikel"
        title="Artikel"
        lead="Catatan kami tentang sistem internal, keamanan data, dan cara memakai teknologi dengan lebih bijak."
      />
      <section aria-label="Daftar artikel" className="section-block">
        <div className="container-narrow flex flex-col gap-10">
          {tags.length > 0 ? (
            <nav aria-label="Filter tag" className="flex flex-wrap gap-2">
              <FilterLink href="/artikel" selected={!tag}>
                Semua
              </FilterLink>
              {tags
                .filter((t) => t.articleCount > 0)
                .map((t) => (
                  <FilterLink key={t.slug} href={`/artikel?tag=${t.slug}`} selected={tag === t.slug}>
                    {t.name}
                  </FilterLink>
                ))}
            </nav>
          ) : null}

          {list.data.length === 0 ? (
            <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-surface p-8">
              <h2 className="text-title text-ink">Belum ada artikel di sini</h2>
              <p className="text-body text-ink-muted">Coba pilih tag lain atau lihat semua artikel.</p>
              <Link href="/artikel" className="font-medium text-cyan-ink hover:underline">
                Lihat semua artikel
              </Link>
            </div>
          ) : null}

          {featured ? (
            <Anim as="article" className="group relative grid overflow-hidden rounded-lg border border-line bg-surface transition-transform duration-300 hover:-translate-y-1.5 lg:grid-cols-2">
              <div className="relative">
                <ArticleCover src={featured.coverImageUrl} alt="" priority sizes="(min-width: 1024px) 560px, 100vw" />
                <StarIcon className="anim-drift pointer-events-none absolute top-6 left-6 h-12 w-12 text-cyan" />
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                <p className="text-tagline text-cyan-ink">
                  Terbaru{featured.tags[0] ? ` · ${featured.tags[0].name}` : ""}
                </p>
                <h2 className="text-heading text-ink transition-colors group-hover:text-cyan-ink">
                  <Link href={`/artikel/${featured.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-body text-ink-muted">{featured.excerpt}</p>
                <p className="text-small text-ink-muted">
                  <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time> · {featured.readMinutes} menit baca
                </p>
                <span className="inline-flex items-center gap-2 font-medium text-cyan-ink transition-[gap] duration-300 group-hover:gap-4">
                  Baca artikel
                  <ArrowIcon className="h-4 w-4" />
                </span>
              </div>
            </Anim>
          ) : null}

          {rest.length > 0 ? (
            <ul className="flex flex-col">
              {rest.map((a, i) =>
                a ? (
                  <Anim as="li" key={a.slug} index={i} className="border-t border-line transition-colors last:border-b hover:bg-surface">
                    <Link
                      href={`/artikel/${a.slug}`}
                      className="group relative flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:gap-8"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-tagline text-cyan-ink">{a.tags[0]?.name ?? "Artikel"}</p>
                        <h3 className="text-title text-ink transition-colors group-hover:text-cyan-ink">{a.title}</h3>
                        <p className="max-w-[640px] text-small text-ink-muted">{a.excerpt}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-start gap-1 text-small text-ink-muted md:items-end">
                        <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
                        <span>{a.readMinutes} menit baca</span>
                        <span
                          aria-hidden="true"
                          className="mt-2 hidden h-11 w-11 items-center justify-center rounded-md border border-line text-ink transition-[background-color,border-color,translate] duration-300 group-hover:translate-x-1 group-hover:border-cyan group-hover:bg-cyan group-hover:text-on-cyan md:flex"
                        >
                          <ArrowIcon className="h-[18px] w-[18px]" />
                        </span>
                      </div>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-cyan transition-transform duration-300 group-hover:scale-x-100"
                      />
                    </Link>
                  </Anim>
                ) : null,
              )}
            </ul>
          ) : null}

          <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Artikel", path: "/artikel" }])} />
    </>
  );
}
