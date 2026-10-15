"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useConfirm } from "@/components/admin/Dialog";
import { ErrorBox, Loading, PageHeader, Panel, TextLink } from "@/components/admin/Page";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api, applyFieldErrors, collapseIndexedPath, errorMessage, unwrap } from "@/lib/api/browser";
import type { ServiceAdmin, ServiceInput } from "@/lib/api/types";
import { arrayToLines, linesToArray } from "@/lib/lines";
import { SLUG_PATTERN, slugify } from "@/lib/slug";

const pkg = z.object({
  name: z.string().trim().min(1, "Nama paket wajib diisi.").max(60),
  priceLabel: z.string().max(40),
  priceValue: z.string().trim().min(1, "Harga wajib diisi.").max(60),
  description: z.string().max(300),
  features: z.string(),
  highlighted: z.boolean(),
});
const schema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(120),
  slug: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || SLUG_PATTERN.test(v), "Gunakan huruf kecil, angka, dan tanda hubung."),
  audience: z.enum(["business", "personal"]),
  eyebrow: z.string().max(60),
  tagline: z.string().max(200),
  summary: z.string().max(400),
  points: z.string(),
  priceLabel: z.string().max(40),
  priceValue: z.string().max(60),
  audienceText: z.string().max(600),
  deliverables: z.array(z.object({ title: z.string().trim().min(1, "Judul wajib diisi.").max(160), body: z.string().max(600) })).max(12),
  systems: z.string(),
  packages: z
    .array(pkg)
    .max(8)
    .refine((ps) => ps.filter((p) => p.highlighted).length <= 1, "Hanya satu paket yang boleh ditonjolkan."),
  seo: z.object({ title: z.string().max(70), description: z.string().max(160), ogImageUrl: z.string().nullable() }),
});
type V = z.infer<typeof schema>;

const EMPTY: V = {
  title: "",
  slug: "",
  audience: "business",
  eyebrow: "",
  tagline: "",
  summary: "",
  points: "",
  priceLabel: "",
  priceValue: "",
  audienceText: "",
  deliverables: [],
  systems: "",
  packages: [],
  seo: { title: "", description: "", ogImageUrl: null },
};

function toForm(s: ServiceAdmin): V {
  return {
    title: s.title,
    slug: s.slug,
    audience: s.audience,
    eyebrow: s.eyebrow,
    tagline: s.tagline,
    summary: s.summary,
    points: arrayToLines(s.points),
    priceLabel: s.priceLabel,
    priceValue: s.priceValue,
    audienceText: s.audienceText,
    deliverables: s.deliverables.map((d) => ({ title: d.title, body: d.body })),
    systems: arrayToLines(s.systems),
    packages: s.packages.map((p) => ({
      name: p.name,
      priceLabel: p.priceLabel,
      priceValue: p.priceValue,
      description: p.description,
      features: arrayToLines(p.features),
      highlighted: p.highlighted,
    })),
    seo: { title: s.seo.title ?? "", description: s.seo.description ?? "", ogImageUrl: s.seo.ogImageUrl ?? null },
  };
}

export default function ServiceEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "baru";
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [formError, setFormError] = useState<string | null>(null);

  const svc = useQuery({
    queryKey: ["admin-service", id],
    enabled: !isNew,
    queryFn: async () => (await unwrap(api.GET("/admin/services/{id}", { params: { path: { id } } }))).data,
  });
  const { register, handleSubmit, control, watch, setValue, reset, setError, formState } = useForm<V>({ resolver: zodResolver(schema), defaultValues: EMPTY });
  const deliverables = useFieldArray({ control, name: "deliverables" });
  const packages = useFieldArray({ control, name: "packages" });

  useEffect(() => {
    if (svc.data) reset(toForm(svc.data));
  }, [svc.data, reset]);
  const title = watch("title");
  const slug = watch("slug");
  const seo = watch("seo");
  useEffect(() => {
    if (!slugTouched) setValue("slug", slugify(title));
  }, [title, slugTouched, setValue]);

  const save = useMutation({
    mutationFn: async ({ v, status }: { v: V; status: "draft" | "published" }) => {
      const body: ServiceInput = {
        title: v.title,
        audience: v.audience,
        eyebrow: v.eyebrow,
        tagline: v.tagline,
        summary: v.summary,
        points: linesToArray(v.points),
        priceLabel: v.priceLabel,
        priceValue: v.priceValue,
        audienceText: v.audienceText,
        deliverables: v.deliverables,
        systems: linesToArray(v.systems),
        packages: v.packages.map((p) => ({ ...p, features: linesToArray(p.features) })),
        seo: { title: v.seo.title || null, description: v.seo.description || null, ogImageUrl: v.seo.ogImageUrl || null },
        status,
        ...(isNew && !slugTouched ? {} : v.slug ? { slug: v.slug } : {}),
      };
      return isNew
        ? (await unwrap(api.POST("/admin/services", { body }))).data
        : (await unwrap(api.PUT("/admin/services/{id}", { params: { path: { id } }, body }))).data;
    },
    onSuccess: (s) => {
      toast.success();
      void qc.invalidateQueries({ queryKey: ["admin-services"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.setQueryData(["admin-service", s.id], s);
      if (isNew) router.replace(`/admin/layanan/${s.id}`);
      else reset(toForm(s));
    },
    onError: (e) => {
      const mapped = applyFieldErrors(e, setError as never, collapseIndexedPath(["points", "systems", "packages.*.features"]));
      setFormError(mapped ? "Periksa kembali isian yang ditandai." : errorMessage(e));
      toast.error(errorMessage(e));
    },
  });
  const del = useMutation({
    mutationFn: async () => unwrap(api.DELETE("/admin/services/{id}", { params: { path: { id } } })),
    onSuccess: () => {
      toast.success("Layanan dihapus");
      void qc.invalidateQueries({ queryKey: ["admin-services"] });
      router.replace("/admin/layanan");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const submit = (status: "draft" | "published") =>
    handleSubmit((v) => {
      setFormError(null);
      save.mutate({ v, status });
    })();

  if (!isNew && svc.isPending) return <Loading />;
  if (!isNew && svc.isError) return <ErrorBox message={svc.error.message} />;
  const e = formState.errors;

  return (
    <form onSubmit={(ev) => ev.preventDefault()} noValidate className="flex flex-col gap-6">
      <PageHeader
        title={isNew ? "Tambah layanan" : "Edit layanan"}
        sub={`Layanan › ${title || "Layanan baru"}`}
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
              <Input label="Judul" error={e.title?.message} {...register("title")} />
              <Select label="Audiens" error={e.audience?.message} {...register("audience")}>
                <option value="business">Perusahaan (B2B)</option>
                <option value="personal">Usaha &amp; personal (B2C)</option>
              </Select>
            </div>
            <Input
              label="Slug (URL)"
              hint={`/layanan/${slug || "…"}`}
              error={e.slug?.message}
              {...register("slug", { onChange: () => setSlugTouched(true) })}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Eyebrow" placeholder="Utama" error={e.eyebrow?.message} {...register("eyebrow")} />
              <Input label="Tagline (hero detail)" error={e.tagline?.message} {...register("tagline")} />
            </div>
            <Textarea label="Ringkasan (kartu)" rows={3} error={e.summary?.message} {...register("summary")} />
            <Textarea label="Poin layanan" hint="Satu poin per baris (tampil di kartu)." rows={4} error={e.points?.message} {...register("points")} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Label harga" placeholder="Model kerja / Mulai dari" error={e.priceLabel?.message} {...register("priceLabel")} />
              <Input label="Harga / model" placeholder="BOS atau BOR" error={e.priceValue?.message} {...register("priceValue")} />
            </div>
            <Textarea label="Untuk siapa" rows={3} error={e.audienceText?.message} {...register("audienceText")} />
            <Textarea label="Sistem yang sering dibangun" hint="Satu sistem per baris (chip), mis. HRIS." rows={3} error={e.systems?.message} {...register("systems")} />
          </Panel>

          <Panel
            title="Yang Kami kerjakan"
            actions={
              <Button size="sm" variant="secondary" onClick={() => deliverables.append({ title: "", body: "" })} disabled={deliverables.fields.length >= 12}>
                Tambah item
              </Button>
            }
          >
            {deliverables.fields.length === 0 ? <p className="text-small text-ink-muted">Belum ada item.</p> : null}
            {deliverables.fields.map((f, i) => (
              <div key={f.id} className="flex flex-col gap-3 border-t border-line pt-4 first:border-t-0 first:pt-0">
                <Input label={`Item ${i + 1}: judul`} error={e.deliverables?.[i]?.title?.message} {...register(`deliverables.${i}.title`)} />
                <Textarea label="Penjelasan" rows={2} error={e.deliverables?.[i]?.body?.message} {...register(`deliverables.${i}.body`)} />
                <div className="flex gap-4">
                  <TextLink onClick={() => i > 0 && deliverables.move(i, i - 1)} disabled={i === 0}>
                    Naik
                  </TextLink>
                  <TextLink onClick={() => deliverables.remove(i)}>Hapus item</TextLink>
                </div>
              </div>
            ))}
            {e.deliverables?.message ? <ErrorBox message={e.deliverables.message} /> : null}
          </Panel>

          <Panel
            title="Paket harga"
            actions={
              <Button
                size="sm"
                variant="secondary"
                disabled={packages.fields.length >= 8}
                onClick={() => packages.append({ name: "", priceLabel: "", priceValue: "", description: "", features: "", highlighted: false })}
              >
                Tambah paket
              </Button>
            }
          >
            <p className="text-small text-ink-muted">Dipakai untuk Web Development. Urutan di sini = urutan tampil. Maksimal satu paket ditonjolkan.</p>
            {packages.fields.map((f, i) => (
              <div key={f.id} className="flex flex-col gap-3 rounded-md border border-line p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Input label="Nama paket" error={e.packages?.[i]?.name?.message} {...register(`packages.${i}.name`)} />
                  <Input label="Label harga" placeholder="Mulai dari" error={e.packages?.[i]?.priceLabel?.message} {...register(`packages.${i}.priceLabel`)} />
                  <Input label="Harga" placeholder="Rp 3.500.000" error={e.packages?.[i]?.priceValue?.message} {...register(`packages.${i}.priceValue`)} />
                </div>
                <Input label="Deskripsi" error={e.packages?.[i]?.description?.message} {...register(`packages.${i}.description`)} />
                <Textarea label="Fitur" hint="Satu fitur per baris." rows={3} error={e.packages?.[i]?.features?.message} {...register(`packages.${i}.features`)} />
                <label className="flex items-center gap-2 text-[14px] font-medium text-ink">
                  <input type="checkbox" className="h-4 w-4 accent-[#30c2db]" {...register(`packages.${i}.highlighted`)} />
                  Tonjolkan paket ini
                </label>
                <div className="flex gap-4">
                  <TextLink onClick={() => i > 0 && packages.move(i, i - 1)} disabled={i === 0}>
                    Naik
                  </TextLink>
                  <TextLink onClick={() => packages.remove(i)}>Hapus paket</TextLink>
                </div>
              </div>
            ))}
            {e.packages?.message || e.packages?.root?.message ? <ErrorBox message={(e.packages?.message ?? e.packages?.root?.message)!} /> : null}
          </Panel>
        </div>
        <div className="flex flex-col gap-6">
          <Panel title="Publikasi">
            <div className="flex items-center justify-between">
              <span className="text-small text-ink-muted">Status saat ini</span>
              <StatusBadge status={svc.data?.status ?? "draft"} />
            </div>
          </Panel>
          <SeoPanel
            register={register}
            errors={e}
            values={{ title: seo.title, description: seo.description }}
            fallbackTitle={title}
            fallbackDescription={watch("summary")}
            path={`/layanan/${slug}`}
          />
          {!isNew ? (
            <Button
              variant="secondary"
              disabled={del.isPending}
              onClick={async () => {
                if (await confirm({ title: "Hapus layanan?", body: `"${svc.data?.title ?? ""}" akan dihapus permanen.` })) del.mutate();
              }}
            >
              Hapus Layanan
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
