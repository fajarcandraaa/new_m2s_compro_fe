"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useConfirm } from "@/components/admin/Dialog";
import { EmptyRow, ErrorBox, Loading, PageHeader, Panel, Table, Td, TextLink, Th } from "@/components/admin/Page";
import { Pager } from "@/components/admin/Pager";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api, applyFieldErrors, errorMessage, unwrap } from "@/lib/api/browser";
import type { PromoAdmin, PromoInput } from "@/lib/api/types";
import { promoDates } from "@/lib/dates";
import { formatPromoPeriod } from "@/lib/format";

const schema = z
  .object({
    title: z.string().trim().min(1, "Judul wajib diisi.").max(160),
    serviceId: z.string(),
    description: z.string().max(1000, "Maksimal 1000 karakter."),
    start: z.string().min(1, "Tanggal mulai wajib diisi."),
    end: z.string().min(1, "Tanggal berakhir wajib diisi."),
    code: z.string().trim().max(40).regex(/^[A-Za-z0-9_-]*$/, "Hanya huruf, angka, - dan _."),
  })
  .refine((v) => !v.start || !v.end || v.end >= v.start, { path: ["end"], message: "Tanggal berakhir tidak boleh sebelum tanggal mulai." });
type V = z.infer<typeof schema>;
const EMPTY: V = { title: "", serviceId: "", description: "", start: "", end: "", code: "" };
const PAGE_SIZE = 20;

const toForm = (p: PromoAdmin): V => ({
  title: p.title,
  serviceId: p.serviceId ?? "",
  description: p.description,
  start: promoDates.isoToStart(p.startsAt),
  end: promoDates.isoToEnd(p.endsAt),
  code: p.code ?? "",
});

/** Promo list + side edit panel (Figma CMS – Promo). Dates follow the exclusive-endsAt convention. */
export default function PromoAdminPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<PromoAdmin | "new" | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const list = useQuery({
    queryKey: ["admin-promos", page],
    queryFn: async () => unwrap(api.GET("/admin/promos", { params: { query: { page, pageSize: PAGE_SIZE } } })),
    placeholderData: keepPreviousData,
  });
  const services = useQuery({ queryKey: ["admin-services"], queryFn: async () => (await unwrap(api.GET("/admin/services"))).data });

  const { register, handleSubmit, reset, setError, formState } = useForm<V>({ resolver: zodResolver(schema), defaultValues: EMPTY });
  useEffect(() => {
    setFormError(null);
    reset(editing && editing !== "new" ? toForm(editing) : EMPTY);
  }, [editing, reset]);

  const save = useMutation({
    mutationFn: async (v: V) => {
      const body: PromoInput = {
        title: v.title,
        serviceId: v.serviceId || null,
        description: v.description,
        startsAt: promoDates.startToIso(v.start),
        endsAt: promoDates.endToIso(v.end),
        code: v.code || null,
      };
      return editing && editing !== "new"
        ? (await unwrap(api.PUT("/admin/promos/{id}", { params: { path: { id: editing.id } }, body }))).data
        : (await unwrap(api.POST("/admin/promos", { body }))).data;
    },
    onSuccess: () => {
      toast.success();
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["admin-promos"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => {
      const mapped = applyFieldErrors(e, setError as never, { startsAt: "start", endsAt: "end" });
      setFormError(mapped ? "Periksa kembali isian yang ditandai." : errorMessage(e));
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => unwrap(api.DELETE("/admin/promos/{id}", { params: { path: { id } } })),
    onSuccess: () => {
      toast.success("Promo dihapus");
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["admin-promos"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const e = formState.errors;

  return (
    <>
      <PageHeader title="Promo" sub="Status dihitung otomatis dari periode" actions={<Button onClick={() => setEditing("new")}>Buat Promo</Button>} />
      {list.isError ? <ErrorBox message={list.error.message} /> : null}
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-4">
          <Table>
            <thead>
              <tr>
                <Th>Promo</Th>
                <Th>Periode</Th>
                <Th>Status</Th>
                <Th>
                  <span className="sr-only">Aksi</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {list.isPending ? (
                <EmptyRow cols={4}>
                  <Loading />
                </EmptyRow>
              ) : null}
              {list.data?.data.length === 0 ? <EmptyRow cols={4}>Belum ada promo.</EmptyRow> : null}
              {list.data?.data.map((p) => (
                <tr key={p.id} className={editing !== "new" && editing?.id === p.id ? "bg-ground" : undefined}>
                  <Td className="font-medium text-ink">{p.title}</Td>
                  <Td className="whitespace-nowrap">{formatPromoPeriod(p.startsAt, p.endsAt)}</Td>
                  <Td>
                    <StatusBadge status={p.status} />
                  </Td>
                  <Td>
                    <TextLink onClick={() => setEditing(p)}>
                      Edit<span className="sr-only"> {p.title}</span>
                    </TextLink>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {list.data ? <Pager page={page} pageSize={PAGE_SIZE} total={list.data.meta.total} onPage={setPage} /> : null}
        </div>
        {editing ? (
          <Panel title={editing === "new" ? "Buat promo" : "Edit promo"}>
            <form onSubmit={handleSubmit((v) => (setFormError(null), save.mutate(v)))} noValidate className="flex flex-col gap-4">
              <Input label="Judul promo" error={e.title?.message} {...register("title")} />
              <Select label="Layanan terkait" optional error={e.serviceId?.message} {...register("serviceId")}>
                <option value="">Tanpa layanan</option>
                {services.data?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </Select>
              <Textarea label="Deskripsi singkat" rows={3} error={e.description?.message} {...register("description")} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Mulai" type="date" error={e.start?.message} {...register("start")} />
                <Input label="Berakhir" type="date" hint="Termasuk hari ini." error={e.end?.message} {...register("end")} />
              </div>
              <Input label="Kode promo" optional error={e.code?.message} {...register("code")} />
              {formError ? <ErrorBox message={formError} /> : null}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={save.isPending}>
                  Simpan
                </Button>
                <Button variant="secondary" onClick={() => setEditing(null)}>
                  Batal
                </Button>
                {editing !== "new" ? (
                  <TextLink
                    className="ml-auto"
                    onClick={async () => {
                      if (await confirm({ title: "Hapus promo?", body: `"${editing.title}" akan dihapus permanen.` })) del.mutate(editing.id);
                    }}
                  >
                    Hapus
                  </TextLink>
                ) : null}
              </div>
            </form>
          </Panel>
        ) : (
          <Panel>
            <p className="text-small text-ink-muted">Pilih Edit pada promo, atau Buat Promo untuk menambah. Promo berakhir tetap tampil redup di situs selama 7 hari.</p>
          </Panel>
        )}
      </div>
    </>
  );
}
