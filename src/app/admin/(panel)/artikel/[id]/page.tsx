"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useConfirm } from "@/components/admin/Dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ErrorBox, Loading, PageHeader, Panel } from "@/components/admin/Page";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { TagInput } from "@/components/admin/TagInput";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api, applyFieldErrors, errorMessage, unwrap } from "@/lib/api/browser";
import type { ArticleAdmin, ArticleInput } from "@/lib/api/types";
import { isoToWibLocal, wibLocalToIso } from "@/lib/dates";
import { SLUG_PATTERN, slugify } from "@/lib/slug";

const schema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200, "Maksimal 200 karakter."),
  slug: z
    .string()
    .trim()
    .max(120, "Maksimal 120 karakter.")
    .refine((v) => v === "" || SLUG_PATTERN.test(v), "Gunakan huruf kecil, angka, dan tanda hubung."),
  excerpt: z.string().max(400, "Maksimal 400 karakter."),
  contentHtml: z.string().max(200000),
  publishedAt: z.string(),
  tags: z.array(z.string()).max(10, "Maksimal 10 tag."),
  coverImageUrl: z.string().nullable(),
  author: z.string().max(120),
  seo: z.object({
    title: z.string().max(70, "Maksimal 70 karakter."),
    description: z.string().max(160, "Maksimal 160 karakter."),
    ogImageUrl: z.string().nullable(),
  }),
});
type V = z.infer<typeof schema>;

const EMPTY: V = {
  title: "",
  slug: "",
  excerpt: "",
  contentHtml: "",
  publishedAt: "",
  tags: [],
  coverImageUrl: null,
  author: "",
  seo: { title: "", description: "", ogImageUrl: null },
};

function toForm(a: ArticleAdmin): V {
  return {
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    contentHtml: a.contentHtml,
    publishedAt: isoToWibLocal(a.publishedAt),
    tags: a.tags.map((t) => t.name),
    coverImageUrl: a.coverImageUrl,
    author: a.author,
    seo: { title: a.seo.title ?? "", description: a.seo.description ?? "", ogImageUrl: a.seo.ogImageUrl ?? null },
  };
}

export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "baru";
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [formError, setFormError] = useState<string | null>(null);

  const article = useQuery({
    queryKey: ["admin-article", id],
    enabled: !isNew,
    queryFn: async () => (await unwrap(api.GET("/admin/articles/{id}", { params: { path: { id } } }))).data,
  });
  const tags = useQuery({ queryKey: ["tags"], queryFn: async () => (await unwrap(api.GET("/tags"))).data });

  const form = useForm<V>({ resolver: zodResolver(schema), defaultValues: EMPTY });
  const { register, handleSubmit, control, watch, setValue, reset, setError, formState } = form;

  useEffect(() => {
    if (article.data) reset(toForm(article.data));
  }, [article.data, reset]);

  const title = watch("title");
  const slug = watch("slug");
  const publishedAt = watch("publishedAt");
  const seo = watch("seo");
  useEffect(() => {
    if (!slugTouched) setValue("slug", slugify(title));
  }, [title, slugTouched, setValue]);

  const future = publishedAt !== "" && new Date(wibLocalToIso(publishedAt)!).getTime() > Date.now();

  const save = useMutation({
    mutationFn: async ({ v, status }: { v: V; status: "draft" | "published" }) => {
      const body: ArticleInput = {
        title: v.title,
        excerpt: v.excerpt,
        contentHtml: v.contentHtml,
        status,
        publishedAt: wibLocalToIso(v.publishedAt),
        tags: v.tags,
        coverImageUrl: v.coverImageUrl,
        author: v.author,
        seo: { title: v.seo.title || null, description: v.seo.description || null, ogImageUrl: v.seo.ogImageUrl || null },
        // Create: omit an untouched slug so the BE generates one (with -2, -3 on collision, never 409).
        ...(isNew && !slugTouched ? {} : v.slug ? { slug: v.slug } : {}),
      };
      return isNew
        ? (await unwrap(api.POST("/admin/articles", { body }))).data
        : (await unwrap(api.PUT("/admin/articles/{id}", { params: { path: { id } }, body }))).data;
    },
    onSuccess: (a) => {
      toast.success();
      void qc.invalidateQueries({ queryKey: ["admin-articles"] });
      void qc.invalidateQueries({ queryKey: ["admin-articles-counts"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.setQueryData(["admin-article", a.id], a);
      if (isNew) router.replace(`/admin/artikel/${a.id}`);
      else reset(toForm(a));
    },
    onError: (e) => {
      const mapped = applyFieldErrors(e, setError as never);
      setFormError(mapped ? "Periksa kembali isian yang ditandai." : errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  const del = useMutation({
    mutationFn: async () => unwrap(api.DELETE("/admin/articles/{id}", { params: { path: { id } } })),
    onSuccess: () => {
      toast.success("Artikel dihapus");
      void qc.invalidateQueries({ queryKey: ["admin-articles"] });
      router.replace("/admin/artikel");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const submit = (status: "draft" | "published") =>
    handleSubmit((v) => {
      setFormError(null);
      save.mutate({ v, status });
    })();

  if (!isNew && article.isPending) return <Loading />;
  if (!isNew && article.isError) return <ErrorBox message={article.error.message} />;

  const current = article.data;
  const e = formState.errors;

  return (
    <form onSubmit={(ev) => ev.preventDefault()} noValidate className="flex flex-col gap-6">
      <PageHeader
        title={isNew ? "Tulis artikel" : "Edit artikel"}
        sub={`Artikel › ${title || "Artikel baru"}`}
        actions={
          <>
            <Button variant="secondary" disabled={save.isPending} onClick={() => submit("draft")}>
              Simpan Draft
            </Button>
            <Button disabled={save.isPending} onClick={() => submit("published")}>
              {future ? "Jadwalkan" : current?.status === "published" ? "Simpan & Terbitkan" : "Terbitkan"}
            </Button>
          </>
        }
      />
      {formError ? <ErrorBox message={formError} /> : null}
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <Panel>
          <Input label="Judul" error={e.title?.message} {...register("title")} />
          <Input
            label="Slug (URL)"
            hint={`/artikel/${slug || "…"}${isNew && !slugTouched ? " · dibuat otomatis dari judul" : ""}`}
            error={e.slug?.message}
            {...register("slug", { onChange: () => setSlugTouched(true) })}
          />
          <Textarea label="Ringkasan" rows={3} placeholder="Muncul di kartu artikel dan hasil pencarian." error={e.excerpt?.message} {...register("excerpt")} />
          <Controller
            control={control}
            name="contentHtml"
            render={({ field, fieldState }) => <RichTextEditor value={field.value} onChange={field.onChange} error={fieldState.error?.message} />}
          />
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel title="Publikasi">
            <div className="flex items-center justify-between">
              <span className="text-small text-ink-muted">Status saat ini</span>
              <StatusBadge status={current ? (current.isScheduled ? "scheduled" : current.status) : "draft"} />
            </div>
            <Input
              label="Jadwal terbit (WIB)"
              type="datetime-local"
              hint={publishedAt ? (future ? "Terjadwal: tampil otomatis pada waktu ini." : "Waktu terbit.") : "Kosong = terbit sekarang saat diterbitkan."}
              error={e.publishedAt?.message}
              {...register("publishedAt")}
            />
            <Controller
              control={control}
              name="tags"
              render={({ field, fieldState }) => (
                <TagInput value={field.value} onChange={field.onChange} suggestions={tags.data?.map((t) => t.name)} error={fieldState.error?.message} />
              )}
            />
            <Input label="Penulis" placeholder="Tim Mind2Screen" error={e.author?.message} {...register("author")} />
          </Panel>
          <Panel title="Gambar sampul">
            <Controller
              control={control}
              name="coverImageUrl"
              render={({ field, fieldState }) => (
                <ImageUpload label="Sampul 16:9" hint="JPG/PNG/WebP, rasio 16:9, maks. 2 MB" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
              )}
            />
          </Panel>
          <SeoPanel
            register={register}
            errors={e}
            values={{ title: seo.title, description: seo.description }}
            fallbackTitle={title}
            fallbackDescription={watch("excerpt")}
            path={`/artikel/${slug}`}
            ogImage={seo.ogImageUrl}
            onOgImage={(v) => setValue("seo.ogImageUrl", v, { shouldDirty: true })}
          />
          {!isNew ? (
            <Button
              variant="secondary"
              disabled={del.isPending}
              onClick={async () => {
                if (await confirm({ title: "Hapus artikel?", body: `"${current?.title ?? ""}" akan dihapus permanen.` })) del.mutate();
              }}
            >
              Hapus Artikel
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
