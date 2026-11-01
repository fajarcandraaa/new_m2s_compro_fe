"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useConfirm } from "@/components/admin/Dialog";
import { ErrorBox, Loading, PageHeader, Panel } from "@/components/admin/Page";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { useToast } from "@/components/admin/Toast";
import { Toggle } from "@/components/admin/Toggle";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api, applyFieldErrors, collapseIndexedPath, errorMessage, unwrap } from "@/lib/api/browser";
import type { CaseStudyAdmin, CaseStudyInput } from "@/lib/api/types";
import { arrayToLines, linesToArray } from "@/lib/lines";
import { SLUG_PATTERN, slugify } from "@/lib/slug";

const LIST_FIELDS = ["scope", "initialConditions", "risks", "approach", "solutions", "impacts"] as const;

const metric = z.object({
  value: z.string().trim().min(1, "Wajib diisi.").max(20, "Maks. 20 karakter."),
  label: z.string().trim().min(1, "Wajib diisi.").max(160),
  before: z.string().trim().max(120, "Maks. 120 karakter."),
});
const schema = z.object({
  systemName: z.string().trim().min(1, "Nama sistem wajib diisi.").max(60),
  category: z.string().trim().min(1, "Kategori wajib diisi.").max(60),
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200),
  slug: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || SLUG_PATTERN.test(v), "Gunakan huruf kecil, angka, dan tanda hubung."),
  summary: z.string().max(400),
  cardBody: z.string().max(400),
  metrics: z.array(metric).length(2),
  scope: z.string(),
  initialConditionsTitle: z.string().max(200),
  initialConditions: z.string(),
  risksTitle: z.string().max(200),
  risks: z.string(),
  approachTitle: z.string().max(200),
  approach: z.string(),
  solutions: z.string(),
  impactTitle: z.string().max(200),
  impacts: z.string(),
  lesson: z.string().max(600),
  featured: z.boolean(),
  seo: z.object({ title: z.string().max(70), description: z.string().max(160), ogImageUrl: z.string().nullable() }),
});
type V = z.infer<typeof schema>;

const EMPTY: V = {
  systemName: "",
  category: "",
  title: "",
  slug: "",
  summary: "",
  cardBody: "",
  metrics: [
    { value: "", label: "", before: "" },
    { value: "", label: "", before: "" },
  ],
  scope: "",
  initialConditionsTitle: "",
  initialConditions: "",
  risksTitle: "",
  risks: "",
  approachTitle: "",
  approach: "",
  solutions: "",
  impactTitle: "",
  impacts: "",
  lesson: "",
  featured: false,
  seo: { title: "", description: "", ogImageUrl: null },
};

function toForm(c: CaseStudyAdmin): V {
  return {
    systemName: c.systemName,
    category: c.category,
    title: c.title,
    slug: c.slug,
    summary: c.summary,
    cardBody: c.cardBody,
    metrics: [0, 1].map((i) => ({
      value: c.metrics[i]?.value ?? "",
      label: c.metrics[i]?.label ?? "",
      before: c.metrics[i]?.before ?? "",
    })),
    scope: arrayToLines(c.scope),
    initialConditionsTitle: c.initialConditionsTitle,
    initialConditions: arrayToLines(c.initialConditions),
    risksTitle: c.risksTitle,
    risks: arrayToLines(c.risks),
    approachTitle: c.approachTitle,
    approach: arrayToLines(c.approach),
    solutions: arrayToLines(c.solutions),
    impactTitle: c.impactTitle,
    impacts: arrayToLines(c.impacts),
    lesson: c.lesson,
    featured: c.featured,
    seo: { title: c.seo.title ?? "", description: c.seo.description ?? "", ogImageUrl: c.seo.ogImageUrl ?? null },
  };
}

export default function CaseStudyEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "baru";
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [formError, setFormError] = useState<string | null>(null);

  const cs = useQuery({
    queryKey: ["admin-case-study", id],
    enabled: !isNew,
    queryFn: async () => (await unwrap(api.GET("/admin/case-studies/{id}", { params: { path: { id } } }))).data,
  });
  const { register, handleSubmit, control, watch, setValue, reset, setError, formState } = useForm<V>({ resolver: zodResolver(schema), defaultValues: EMPTY });
  useEffect(() => {
    if (cs.data) reset(toForm(cs.data));
  }, [cs.data, reset]);
  const title = watch("title");
  const slug = watch("slug");
  const seo = watch("seo");
  useEffect(() => {
    if (!slugTouched) setValue("slug", slugify(title));
  }, [title, slugTouched, setValue]);

  const save = useMutation({
    mutationFn: async ({ v, status }: { v: V; status: "draft" | "published" }) => {
      const body: CaseStudyInput = {
        systemName: v.systemName,
        category: v.category,
        title: v.title,
        summary: v.summary,
        cardBody: v.cardBody,
        metrics: v.metrics,
        scope: linesToArray(v.scope),
        initialConditionsTitle: v.initialConditionsTitle,
        initialConditions: linesToArray(v.initialConditions),
        risksTitle: v.risksTitle,
        risks: linesToArray(v.risks),
        approachTitle: v.approachTitle,
        approach: linesToArray(v.approach),
        solutions: linesToArray(v.solutions),
        impactTitle: v.impactTitle,
        impacts: linesToArray(v.impacts),
        lesson: v.lesson,
        featured: v.featured,
        status,
        seo: { title: v.seo.title || null, description: v.seo.description || null, ogImageUrl: v.seo.ogImageUrl || null },
        ...(cs.data ? { sortOrder: cs.data.sortOrder } : {}),
        ...(isNew && !slugTouched ? {} : v.slug ? { slug: v.slug } : {}),
      };
      return isNew
        ? (await unwrap(api.POST("/admin/case-studies", { body }))).data
        : (await unwrap(api.PUT("/admin/case-studies/{id}", { params: { path: { id } }, body }))).data;
    },
    onSuccess: (c) => {
      toast.success();
      void qc.invalidateQueries({ queryKey: ["admin-case-studies"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.setQueryData(["admin-case-study", c.id], c);
      if (isNew) router.replace(`/admin/studi-kasus/${c.id}`);
      else reset(toForm(c));
    },
    onError: (e) => {
      const mapped = applyFieldErrors(e, setError as never, collapseIndexedPath([...LIST_FIELDS]));
      setFormError(mapped ? "Periksa kembali isian yang ditandai." : errorMessage(e));
      toast.error(errorMessage(e));
    },
  });
  const del = useMutation({
    mutationFn: async () => unwrap(api.DELETE("/admin/case-studies/{id}", { params: { path: { id } } })),
    onSuccess: () => {
      toast.success("Studi kasus dihapus");
      void qc.invalidateQueries({ queryKey: ["admin-case-studies"] });
      router.replace("/admin/studi-kasus");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const submit = (status: "draft" | "published") =>
    handleSubmit((v) => {
      setFormError(null);
      save.mutate({ v, status });
    })();

  if (!isNew && cs.isPending) return <Loading />;
  if (!isNew && cs.isError) return <ErrorBox message={cs.error.message} />;
  const e = formState.errors;

  const story: Array<{ titleField?: keyof V; titleLabel?: string; field: keyof V; label: string }> = [
    { titleField: "initialConditionsTitle", titleLabel: "Judul kondisi awal", field: "initialConditions", label: "Kondisi awal" },
    { titleField: "risksTitle", titleLabel: "Judul risiko", field: "risks", label: "Risiko jika dibiarkan" },
    { titleField: "approachTitle", titleLabel: "Judul pendekatan", field: "approach", label: "Pendekatan" },
    { field: "solutions", label: "Yang Kami bangun (solusi)" },
    { titleField: "impactTitle", titleLabel: "Judul dampak", field: "impacts", label: "Dampak bisnis" },
  ];

  return (
    <form onSubmit={(ev) => ev.preventDefault()} noValidate className="flex flex-col gap-6">
      <PageHeader
        title={isNew ? "Tambah studi kasus" : "Edit studi kasus"}
        sub={`Studi Kasus › ${watch("systemName") || "Baru"}`}
        actions={
          <>
            <Button variant="secondary" disabled={save.isPending} onClick={() => submit("draft")}>
              Simpan Draft
            </Button>
            <Button disabled={save.isPending} onClick={() => submit("published")}>
              Terbitkan
            </Button>
          </>
        }
      />
      {formError ? <ErrorBox message={formError} /> : null}
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <Panel>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Nama sistem" placeholder="TUMBUH" error={e.systemName?.message} {...register("systemName")} />
              <Input label="Kategori" placeholder="HRIS" hint="Dipakai untuk filter di /studi-kasus." error={e.category?.message} {...register("category")} />
            </div>
            <Input label="Judul" error={e.title?.message} {...register("title")} />
            <Input label="Slug (URL)" hint={`/studi-kasus/${slug || "…"}`} error={e.slug?.message} {...register("slug", { onChange: () => setSlugTouched(true) })} />
            <Textarea label="Ringkasan" rows={3} hint="Lead di halaman detail." error={e.summary?.message} {...register("summary")} />
            <Textarea label="Teks kartu" rows={3} hint="Tampil di kartu studi kasus." error={e.cardBody?.message} {...register("cardBody")} />
            <Textarea label="Cakupan sistem" rows={3} hint="Satu item per baris (chip)." error={e.scope?.message} {...register("scope")} />
          </Panel>
          <Panel title="Cerita">
            <p className="text-small text-ink-muted">Satu poin per baris. Tiap bagian tampil sebagai daftar di halaman detail.</p>
            {story.map((s) => (
              <div key={s.field} className="flex flex-col gap-3">
                {s.titleField ? (
                  <Input label={s.titleLabel} error={(e[s.titleField] as { message?: string } | undefined)?.message} {...register(s.titleField)} />
                ) : null}
                <Textarea label={s.label} rows={4} error={(e[s.field] as { message?: string } | undefined)?.message} {...register(s.field)} />
              </div>
            ))}
            <Textarea label="Pelajaran (kutipan)" rows={2} error={e.lesson?.message} {...register("lesson")} />
          </Panel>
        </div>
        <div className="flex flex-col gap-6">
          <Panel title="Angka dampak">
            <p className="text-small text-ink-muted">Tampil di kartu studi kasus. Pakai angka yang bisa dipertanggungjawabkan.</p>
            {[0, 1].map((i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-[80px_1fr_1fr]">
                <Input label={`Angka ${i + 1}`} error={e.metrics?.[i]?.value?.message} {...register(`metrics.${i}.value` as const)} />
                <Input label="Keterangan" error={e.metrics?.[i]?.label?.message} {...register(`metrics.${i}.label` as const)} />
                <Input
                  label="Sebelumnya (opsional)"
                  placeholder="mis. 4 spreadsheet terpisah"
                  error={e.metrics?.[i]?.before?.message}
                  {...register(`metrics.${i}.before` as const)}
                />
              </div>
            ))}
            {e.metrics?.message ? <ErrorBox message={e.metrics.message} /> : null}
          </Panel>
          <Panel title="Publikasi">
            <div className="flex items-center justify-between">
              <span className="text-small text-ink-muted">Status saat ini</span>
              <StatusBadge status={cs.data?.status ?? "draft"} />
            </div>
            <Controller
              control={control}
              name="featured"
              render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} label="Tampilkan di Beranda" help="Maks. 2 studi kasus unggulan." />}
            />
            {e.featured?.message ? <ErrorBox message={e.featured.message} /> : null}
          </Panel>
          <SeoPanel
            register={register}
            errors={e}
            values={{ title: seo.title, description: seo.description }}
            fallbackTitle={title}
            fallbackDescription={watch("summary")}
            path={`/studi-kasus/${slug}`}
          />
          {!isNew ? (
            <Button
              variant="secondary"
              disabled={del.isPending}
              onClick={async () => {
                if (await confirm({ title: "Hapus studi kasus?", body: `"${cs.data?.title ?? ""}" akan dihapus permanen.` })) del.mutate();
              }}
            >
              Hapus Studi Kasus
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
