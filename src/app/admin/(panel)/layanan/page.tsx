"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { EmptyRow, ErrorBox, Loading, PageHeader, Table, Td, TextLink, Th } from "@/components/admin/Page";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api, errorMessage, unwrap } from "@/lib/api/browser";
import type { ServiceAdmin } from "@/lib/api/types";

export default function LayananListPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const list = useQuery({ queryKey: ["admin-services"], queryFn: async () => (await unwrap(api.GET("/admin/services"))).data });

  const reorder = useMutation({
    mutationFn: async (ids: string[]) => (await unwrap(api.PUT("/admin/services/order", { body: { ids } }))).data,
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: ["admin-services"] });
      const prev = qc.getQueryData<ServiceAdmin[]>(["admin-services"]);
      if (prev) qc.setQueryData(["admin-services"], ids.map((id) => prev.find((s) => s.id === id)!).filter(Boolean));
      return { prev };
    },
    onError: (e, _ids, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin-services"], ctx.prev);
      toast.error(errorMessage(e));
    },
    onSuccess: () => toast.success("Urutan tersimpan"),
    onSettled: () => void qc.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  const move = (i: number, d: -1 | 1) => {
    const items = list.data;
    if (!items) return;
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((s) => s.id);
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    reorder.mutate(ids);
  };

  return (
    <>
      <PageHeader title="Layanan" sub="Urutan di tabel = urutan tampil di situs" actions={<Button href="/admin/layanan/baru">Tambah Layanan</Button>} />
      {list.isError ? <ErrorBox message={list.error.message} /> : null}
      <Table>
        <thead>
          <tr>
            <Th>Urutan</Th>
            <Th>Layanan</Th>
            <Th>Audiens</Th>
            <Th>Harga/model</Th>
            <Th>Status</Th>
            <Th>
              <span className="sr-only">Aksi</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {list.isPending ? (
            <EmptyRow cols={6}>
              <Loading />
            </EmptyRow>
          ) : null}
          {list.data?.length === 0 ? <EmptyRow cols={6}>Belum ada layanan.</EmptyRow> : null}
          {list.data?.map((s, i) => (
            <tr key={s.id}>
              <Td className="text-ink">
                <div className="flex items-center gap-3">
                  <span className="w-5">{i + 1}</span>
                  <TextLink onClick={() => move(i, -1)} disabled={i === 0 || reorder.isPending} aria-label={`Naikkan ${s.title}`}>
                    Naik
                  </TextLink>
                  <TextLink onClick={() => move(i, 1)} disabled={i === list.data.length - 1 || reorder.isPending} aria-label={`Turunkan ${s.title}`}>
                    Turun
                  </TextLink>
                </div>
              </Td>
              <Td className="text-ink">{s.title}</Td>
              <Td>{s.audience === "business" ? "Perusahaan" : "Usaha & personal"}</Td>
              <Td>{[s.priceLabel === "Mulai dari" ? "Mulai" : "", s.priceValue].filter(Boolean).join(" ") || "—"}</Td>
              <Td>
                <StatusBadge status={s.status} />
              </Td>
              <Td>
                <Link href={`/admin/layanan/${s.id}`} className="font-medium text-cyan-ink hover:underline">
                  Edit<span className="sr-only"> {s.title}</span>
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="text-small text-ink-muted">Gunakan tombol Naik/Turun untuk mengubah urutan. Perubahan langsung tersimpan.</p>
    </>
  );
}
