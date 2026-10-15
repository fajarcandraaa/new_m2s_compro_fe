"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input, Textarea } from "@/components/ui/Field";
import { ImageUpload } from "./ImageUpload";
import { Panel } from "./Page";

type SeoForm = { seo: { title: string; description: string; ogImageUrl: string | null } };

/** SEO panel with a Google-style preview (Figma Artikel / Editor). */
export function SeoPanel<T extends SeoForm>({
  register,
  errors,
  values,
  fallbackTitle,
  fallbackDescription,
  path,
  ogImage,
  onOgImage,
}: {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  values: { title: string; description: string };
  fallbackTitle: string;
  fallbackDescription: string;
  path: string;
  ogImage?: string | null;
  onOgImage?: (v: string | null) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reg = register as unknown as UseFormRegister<any>;
  const e = (errors as FieldErrors<SeoForm>).seo;
  const title = (values.title || fallbackTitle || "Judul halaman").slice(0, 70);
  const desc = (values.description || fallbackDescription || "Deskripsi halaman").slice(0, 160);
  const host = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mindtoscreen.com").replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <Panel title="SEO">
      <Input label="Judul SEO" maxLength={70} hint={`${values.title.length}/70`} error={e?.title?.message} {...reg("seo.title")} />
      <Textarea label="Meta description" maxLength={160} rows={4} hint={`${values.description.length}/160`} error={e?.description?.message} {...reg("seo.description")} />
      {onOgImage ? <ImageUpload label="Gambar OG (opsional)" value={ogImage ?? null} onChange={onOgImage} error={e?.ogImageUrl?.message} /> : null}
      <div aria-label="Pratinjau Google" className="flex flex-col gap-1 rounded-sm bg-ground p-3">
        <p className="truncate text-[13px] leading-[20px] text-ink-muted">
          {host} › {path.split("/").filter(Boolean).join(" › ")}
        </p>
        <p className="text-[15px] leading-[22px] font-medium text-cyan-ink">{title} | Mind2Screen</p>
        <p className="line-clamp-3 text-[13px] leading-[20px] text-ink-muted">{desc}</p>
      </div>
    </Panel>
  );
}
