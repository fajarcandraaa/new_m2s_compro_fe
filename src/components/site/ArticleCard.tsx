import Link from "next/link";
import type { ArticleSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { ArticleCover } from "./ArticleCover";

/** Article Card (Figma): 16:9 cover, first tag as category, date + reading time, title, excerpt. */
export function ArticleCard({ article }: { article: ArticleSummary }) {
  const tag = article.tags[0];
  return (
    <article className="group relative flex flex-col gap-4">
      <ArticleCover src={article.coverImageUrl} alt="" />
      <p className="flex flex-wrap items-baseline gap-2 text-[14px]">
        {tag ? <span className="text-tagline text-cyan-ink">{tag.name}</span> : null}
        <span className="text-small text-ink-muted">
          · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.readMinutes} menit
        </span>
      </p>
      <h3 className="text-title text-ink group-hover:text-cyan-ink">
        <Link href={`/artikel/${article.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {article.title}
        </Link>
      </h3>
      <p className="text-small text-ink-muted">{article.excerpt}</p>
    </article>
  );
}
