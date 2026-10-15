"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useIsAdmin } from "@/components/admin/auth";
import { EmptyRow, ErrorBox, Loading, PageHeader, Panel, Table, Td, Th } from "@/components/admin/Page";
import { Pager } from "@/components/admin/Pager";
import { useToast } from "@/components/admin/Toast";
import { useDebounced } from "@/components/admin/useDebounced";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { StatusBadge, statusLabel } from "@/components/ui/StatusBadge";
import { api, errorMessage, unwrap } from "@/lib/api/browser";
import type { Lead, LeadStatus } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { relativeDay } from "@/lib/dates";
import { whatsappUrl } from "@/lib/site";

const PAGE_SIZE = 20;

function LeadDetail({ id, isAdmin }: { id: string; isAdmin: boolean }) {
  const qc = useQueryClient();
  const toast = useToast();
  const lead = useQuery({
    queryKey: ["admin-lead", id],
    queryFn: async () => (await unwrap(api.GET("/admin/leads/{id}", { params: { path: { id } } }))).data,
  });
  const [notes, setNotes] = useState("");
  useEffect(() => {
    setNotes(lead.data?.notes ?? "");
  }, [lead.data?.id, lead.data?.notes]);

  const patch = useMutation({
    mutationFn: async (body: { status?: LeadStatus; notes?: string | null }) =>
      (await unwrap(api.PATCH("/admin/leads/{id}", { params: { path: { id } }, body }))).data,
    onSuccess: (l) => {
      qc.setQueryData(["admin-lead", id], l);
      void qc.invalidateQueries({ queryKey: ["admin-leads"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (lead.isPending) return <Loading />;
  if (lead.isError) return <ErrorBox message={lead.error.message} />;
  const l: Lead = lead.data;
  const greeting = `Halo ${l.name}, terima kasih sudah mengirim brief ke Mind2Screen.`;
  const rows: Array<[string, React.ReactNode]> = [
    ["Perusahaan", l.company ?? "—"],
    ["Email", <a key="e" href={`mailto:${l.email}`} className="text-cyan-ink hover:underline">{l.email}</a>],
    ["WhatsApp", l.whatsapp],
    ["Layanan", l.serviceTitle ?? "—"],
    ["Perkiraan mulai", l.startTimeframe ?? "—"],
    ["Masuk", formatDateTime(l.createdAt)],
  ];

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-title text-ink">{l.name}</h2>
        <StatusBadge status={l.status} />
      </div>
      <dl className="flex flex-col gap-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-small text-ink-muted">{k}</dt>
            <dd className="text-[14px] leading-[22px] text-ink">{v}</dd>
          </div>
        ))}
        <div>
          <dt className="text-small text-ink-muted">Kebutuhan</dt>
          <dd className="text-[14px] leading-[22px] whitespace-pre-line text-ink">{l.message}</dd>
        </div>
      </dl>
      {isAdmin ? (
        <>
          <Select label="Status follow-up" value={l.status} disabled={patch.isPending} onChange={(e) => patch.mutate({ status: e.target.value as LeadStatus })}>
            <option value="new">Baru</option>
            <option value="contacted">Dihubungi</option>
            <option value="done">Selesai</option>
          </Select>
          <Textarea label="Catatan internal" rows={4} placeholder="Tulis catatan untuk tim..." value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} />
          <Button variant="secondary" size="sm" className="self-start" disabled={patch.isPending || notes === (l.notes ?? "")} onClick={() => patch.mutate({ notes: notes.trim() || null })}>
            Simpan Catatan
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-1 rounded-sm bg-ground p-3">
          <p className="text-small text-ink-muted">Status follow-up: {statusLabel(l.status)}</p>
          {l.notes ? <p className="text-small whitespace-pre-line text-ink">{l.notes}</p> : null}
          <p className="text-small text-ink-muted">Hanya Admin yang dapat mengubah status dan catatan.</p>
        </div>
      )}
      <Button href={whatsappUrl(l.whatsapp, greeting)} className="w-full">
        Hubungi via WhatsApp
      </Button>
    </Panel>
  );
}

function LeadsInner() {
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const selected = sp.get("id");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | LeadStatus>("");
  const [page, setPage] = useState(1);
  const dq = useDebounced(q.trim());

  const list = useQuery({
    queryKey: ["admin-leads", dq, status, page],
    queryFn: async () =>
      unwrap(api.GET("/admin/leads", { params: { query: { page, pageSize: PAGE_SIZE, ...(dq ? { q: dq } : {}), ...(status ? { status } : {}) } } })),
    placeholderData: keepPreviousData,
  });
  const select = (id: string) => router.replace(`${pathname}?id=${id}`, { scroll: false });
  const exportHref = `/api/v1/admin/leads/export?${new URLSearchParams({ ...(dq ? { q: dq } : {}), ...(status ? { status } : {}) }).toString()}`;

  return (
    <>
      <PageHeader
        title="Leads"
        sub="Brief dari form Diskusi Kebutuhan"
        actions={
          isAdmin ? (
            <a href={exportHref} download className="inline-flex items-center rounded-md border border-line bg-surface px-6 py-4 font-medium text-ink hover:border-cyan">
              Ekspor CSV
            </a>
          ) : null
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
            <Input label="Cari" type="search" placeholder="Nama atau perusahaan" value={q} onChange={(e) => (setQ(e.target.value), setPage(1))} />
            <Select label="Status" value={status} onChange={(e) => (setStatus(e.target.value as typeof status), setPage(1))}>
              <option value="">Semua status</option>
              <option value="new">Baru</option>
              <option value="contacted">Dihubungi</option>
              <option value="done">Selesai</option>
            </Select>
          </div>
          {list.isError ? <ErrorBox message={list.error.message} /> : null}
          <Table>
            <thead>
              <tr>
                <Th>Nama</Th>
                <Th>Perusahaan</Th>
                <Th>Masuk</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {list.isPending ? (
                <EmptyRow cols={4}>
                  <Loading />
                </EmptyRow>
              ) : null}
              {list.data?.data.length === 0 ? <EmptyRow cols={4}>Belum ada leads.</EmptyRow> : null}
              {list.data?.data.map((l) => (
                <tr key={l.id} className={cn("cursor-pointer hover:bg-ground", selected === l.id && "bg-ground")} onClick={() => select(l.id)}>
                  <Td className="font-medium text-ink">
                    <button type="button" className="text-left hover:underline" onClick={() => select(l.id)} aria-current={selected === l.id ? "true" : undefined}>
                      {l.name}
                    </button>
                  </Td>
                  <Td>{l.company ?? "—"}</Td>
                  <Td className="whitespace-nowrap">{relativeDay(l.createdAt)}</Td>
                  <Td>
                    <StatusBadge status={l.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {list.data ? <Pager page={page} pageSize={PAGE_SIZE} total={list.data.meta.total} onPage={setPage} /> : null}
        </div>
        {selected ? (
          <LeadDetail key={selected} id={selected} isAdmin={isAdmin} />
        ) : (
          <Panel>
            <p className="text-small text-ink-muted">Pilih lead untuk melihat detail.</p>
          </Panel>
        )}
      </div>
    </>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LeadsInner />
    </Suspense>
  );
}
