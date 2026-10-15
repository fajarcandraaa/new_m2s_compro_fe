"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, useConfirm } from "@/components/admin/Dialog";
import { uploadMedia, ACCEPT } from "@/components/admin/media";
import { EmptyRow, ErrorBox, Loading, PageHeader, Panel, Table, Td, TextLink, Th } from "@/components/admin/Page";
import { useToast } from "@/components/admin/Toast";
import { Toggle } from "@/components/admin/Toggle";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { api, applyFieldErrors, errorMessage, unwrap } from "@/lib/api/browser";
import type { ClientLogoAdmin, SettingsAdmin, SettingsTogglesInput, TestimonialAdmin, TestimonialInput } from "@/lib/api/types";

const schema = z.object({
  clientName: z.string().trim().min(1, "Nama klien wajib diisi.").max(120),
  clientRole: z.string().trim().max(120),
  company: z.string().trim().max(160),
  quote: z.string().trim().min(1, "Kutipan wajib diisi.").max(600),
  isActive: z.boolean(),
});
type V = z.infer<typeof schema>;
const EMPTY: V = { clientName: "", clientRole: "", company: "", quote: "", isActive: true };

function swap<T>(arr: T[], i: number, j: number) {
  const a = [...arr];
  [a[i], a[j]] = [a[j]!, a[i]!];
  return a;
}

/** Testimoni & logo klien (Figma CMS – Testimoni): both homepage toggles on top, CRUD + order. */
export default function TestimoniAdminPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<TestimonialAdmin | "new" | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [logoErr, setLogoErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: async () => (await unwrap(api.GET("/admin/settings"))).data });
  const items = useQuery({ queryKey: ["admin-testimonials"], queryFn: async () => (await unwrap(api.GET("/admin/testimonials"))).data });
  const logos = useQuery({ queryKey: ["admin-client-logos"], queryFn: async () => (await unwrap(api.GET("/admin/client-logos"))).data });

  const toggles = useMutation({
    mutationFn: async (body: SettingsTogglesInput) => (await unwrap(api.PATCH("/admin/settings/toggles", { body }))).data,
    onMutate: async (body) => {
      const prev = qc.getQueryData<SettingsAdmin>(["admin-settings"]);
      if (prev) qc.setQueryData(["admin-settings"], { ...prev, ...body });
      return { prev };
    },
    onError: (e, _b, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin-settings"], ctx.prev);
      toast.error(errorMessage(e));
    },
    onSuccess: (s) => {
      qc.setQueryData(["admin-settings"], s);
      toast.success();
    },
  });

  const { register, handleSubmit, reset, setError, formState, watch, setValue } = useForm<V>({ resolver: zodResolver(schema), defaultValues: EMPTY });
  useEffect(() => {
    setFormError(null);
    reset(
      editing && editing !== "new"
        ? { clientName: editing.clientName, clientRole: editing.clientRole, company: editing.company ?? "", quote: editing.quote, isActive: editing.isActive }
        : EMPTY,
    );
  }, [editing, reset]);

  const toInput = (t: { clientName: string; clientRole: string; company: string | null; quote: string; isActive: boolean }): TestimonialInput => ({
    clientName: t.clientName,
    clientRole: t.clientRole,
    company: t.company || null,
    quote: t.quote,
    isActive: t.isActive,
  });

  const save = useMutation({
    mutationFn: async ({ id, body }: { id?: string; body: TestimonialInput }) =>
      id
        ? (await unwrap(api.PUT("/admin/testimonials/{id}", { params: { path: { id } }, body }))).data
        : (await unwrap(api.POST("/admin/testimonials", { body }))).data,
    onSuccess: () => {
      toast.success();
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (e) => {
      const mapped = applyFieldErrors(e, setError as never);
      setFormError(mapped ? "Periksa kembali isian yang ditandai." : errorMessage(e));
      toast.error(errorMessage(e));
    },
  });
  const delT = useMutation({
    mutationFn: async (id: string) => unwrap(api.DELETE("/admin/testimonials/{id}", { params: { path: { id } } })),
    onSuccess: () => {
      toast.success("Testimoni dihapus");
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const orderT = useMutation({
    mutationFn: async (ids: string[]) => unwrap(api.PUT("/admin/testimonials/order", { body: { ids } })),
    onSuccess: () => toast.success("Urutan tersimpan"),
    onError: (e) => toast.error(errorMessage(e)),
    onSettled: () => void qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  const addLogo = useMutation({
    mutationFn: async (file: File) => {
      const m = await uploadMedia(file);
      const name = logoName.trim() || file.name.replace(/\.[^.]+$/, "");
      return (await unwrap(api.POST("/admin/client-logos", { body: { name, imageUrl: m.url } }))).data;
    },
    onSuccess: () => {
      toast.success("Logo diunggah");
      setLogoName("");
      setLogoErr(null);
      void qc.invalidateQueries({ queryKey: ["admin-client-logos"] });
    },
    onError: (e) => setLogoErr(errorMessage(e)),
    onSettled: () => {
      if (fileRef.current) fileRef.current.value = "";
    },
  });
  const delLogo = useMutation({
    mutationFn: async (id: string) => unwrap(api.DELETE("/admin/client-logos/{id}", { params: { path: { id } } })),
    onSuccess: () => {
      toast.success("Logo dihapus");
      void qc.invalidateQueries({ queryKey: ["admin-client-logos"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const orderLogo = useMutation({
    mutationFn: async (ids: string[]) => unwrap(api.PUT("/admin/client-logos/order", { body: { ids } })),
    onSuccess: () => toast.success("Urutan tersimpan"),
    onError: (e) => toast.error(errorMessage(e)),
    onSettled: () => void qc.invalidateQueries({ queryKey: ["admin-client-logos"] }),
  });

  const s = settings.data;
  const t = items.data ?? [];
  const l: ClientLogoAdmin[] = logos.data ?? [];
  const e = formState.errors;

  return (
    <>
      <PageHeader title="Testimoni & logo klien" actions={<Button onClick={() => setEditing("new")}>Tambah Testimoni</Button>} />
      {settings.isError ? <ErrorBox message={settings.error.message} /> : null}
      <section className="rounded-lg border border-cyan bg-surface p-6">
        {s ? (
          <Toggle
            checked={s.showTestimonials}
            onChange={(v) => toggles.mutate({ showTestimonials: v })}
            disabled={toggles.isPending}
            label="Tampilkan section Testimoni di Beranda"
            help="Jika dimatikan, seluruh section testimoni disembunyikan dari situs publik. Data testimoni tetap tersimpan di sini."
          />
        ) : (
          <Loading />
        )}
      </section>

      {items.isError ? <ErrorBox message={items.error.message} /> : null}
      <Table>
        <thead>
          <tr>
            <Th>Klien</Th>
            <Th>Kutipan</Th>
            <Th>Tampil</Th>
            <Th>Urutan</Th>
            <Th>
              <span className="sr-only">Aksi</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {items.isPending ? (
            <EmptyRow cols={5}>
              <Loading />
            </EmptyRow>
          ) : null}
          {items.data?.length === 0 ? <EmptyRow cols={5}>Belum ada testimoni.</EmptyRow> : null}
          {t.map((x, i) => (
            <tr key={x.id}>
              <Td className="font-medium whitespace-nowrap text-ink">
                {x.clientName}
                {x.clientRole ? ` · ${x.clientRole}` : ""}
              </Td>
              <Td className="max-w-[460px]">&ldquo;{x.quote.length > 120 ? `${x.quote.slice(0, 120)}…` : x.quote}&rdquo;</Td>
              <Td>
                <Toggle
                  hideLabel
                  label={`Tampilkan testimoni ${x.clientName}`}
                  checked={x.isActive}
                  disabled={save.isPending}
                  onChange={(v) => save.mutate({ id: x.id, body: toInput({ ...x, isActive: v }) })}
                />
              </Td>
              <Td>
                <div className="flex gap-3">
                  <TextLink disabled={i === 0 || orderT.isPending} onClick={() => orderT.mutate(swap(t, i, i - 1).map((y) => y.id))} aria-label={`Naikkan ${x.clientName}`}>
                    Naik
                  </TextLink>
                  <TextLink disabled={i === t.length - 1 || orderT.isPending} onClick={() => orderT.mutate(swap(t, i, i + 1).map((y) => y.id))} aria-label={`Turunkan ${x.clientName}`}>
                    Turun
                  </TextLink>
                </div>
              </Td>
              <Td>
                <TextLink onClick={() => setEditing(x)}>
                  Edit<span className="sr-only"> {x.clientName}</span>
                </TextLink>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="text-small text-ink-muted">Beranda menampilkan maksimal 3 testimoni yang aktif, sesuai urutan di tabel.</p>

      <Panel
        title="Logo klien"
        actions={
          <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={addLogo.isPending}>
            {addLogo.isPending ? "Mengunggah" : "Unggah Logo"}
          </Button>
        }
      >
        {s ? (
          <Toggle checked={s.showClientLogos} onChange={(v) => toggles.mutate({ showClientLogos: v })} disabled={toggles.isPending} label="Tampilkan strip logo klien di hero" />
        ) : null}
        <div className="max-w-[360px]">
          <Input label="Nama klien untuk logo berikutnya" optional hint="Dipakai sebagai teks alternatif. Kosong = nama file." value={logoName} onChange={(ev) => setLogoName(ev.target.value)} />
        </div>
        <input ref={fileRef} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(ev) => ev.target.files?.[0] && addLogo.mutate(ev.target.files[0])} />
        {logoErr ? <ErrorBox message={logoErr} /> : null}
        {l.length === 0 ? <p className="text-small text-ink-muted">Belum ada logo. Strip logo hanya tampil jika saklar aktif dan ada minimal satu logo.</p> : null}
        <ul className="flex flex-wrap gap-3">
          {l.map((x, i) => (
            <li key={x.id} className="flex w-[160px] flex-col gap-2">
              <div className="flex h-16 items-center justify-center rounded-md border border-line p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.imageUrl} alt={x.name} className="max-h-full max-w-full object-contain" />
              </div>
              <span className="truncate text-small text-ink">{x.name}</span>
              <div className="flex gap-2 text-[12px]">
                <TextLink className="text-[12px]" disabled={i === 0} onClick={() => orderLogo.mutate(swap(l, i, i - 1).map((y) => y.id))} aria-label={`Geser ${x.name} ke kiri`}>
                  Kiri
                </TextLink>
                <TextLink className="text-[12px]" disabled={i === l.length - 1} onClick={() => orderLogo.mutate(swap(l, i, i + 1).map((y) => y.id))} aria-label={`Geser ${x.name} ke kanan`}>
                  Kanan
                </TextLink>
                <TextLink
                  className="text-[12px] text-ink-muted"
                  onClick={async () => {
                    if (await confirm({ title: "Hapus logo?", body: `Logo "${x.name}" akan dihapus.` })) delLogo.mutate(x.id);
                  }}
                >
                  Hapus
                </TextLink>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Tambah testimoni" : "Edit testimoni"}>
        <form
          noValidate
          onSubmit={handleSubmit((v) => {
            setFormError(null);
            save.mutate({ id: editing && editing !== "new" ? editing.id : undefined, body: toInput({ ...v, company: v.company || null }) });
          })}
          className="flex flex-col gap-4"
        >
          <Input label="Nama klien" error={e.clientName?.message} {...register("clientName")} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Jabatan" error={e.clientRole?.message} {...register("clientRole")} />
            <Input label="Perusahaan" optional error={e.company?.message} {...register("company")} />
          </div>
          <Textarea label="Kutipan" rows={4} hint="Gunakan kutipan yang sudah disetujui klien." error={e.quote?.message} {...register("quote")} />
          <Toggle checked={watch("isActive")} onChange={(v) => setValue("isActive", v)} label="Tampil di situs" />
          {formError ? <ErrorBox message={formError} /> : null}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="sm" disabled={save.isPending}>
              Simpan
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>
              Batal
            </Button>
            {editing && editing !== "new" ? (
              <TextLink
                className="ml-auto"
                onClick={async () => {
                  if (await confirm({ title: "Hapus testimoni?", body: `Testimoni dari ${editing.clientName} akan dihapus.` })) delT.mutate(editing.id);
                }}
              >
                Hapus
              </TextLink>
            ) : null}
          </div>
        </form>
      </Dialog>
    </>
  );
}
