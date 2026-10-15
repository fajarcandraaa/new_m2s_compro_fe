"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { EmptyRow, ErrorBox, Loading, PageHeader, Panel, Table, Td, Th } from "@/components/admin/Page";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api, unwrap } from "@/lib/api/browser";
import { relativeDay } from "@/lib/dates";

const TYPE: Record<string, { label: string; href: (id: string) => string }> = {
  article: { label: "Artikel", href: (id) => `/admin/artikel/${id}` },
  service: { label: "Layanan", href: (id) => `/admin/layanan/${id}` },
  case_study: { label: "Studi Kasus", href: (id) => `/admin/studi-kasus/${id}` },
};

export default function DashboardPage() {
  const q = useQuery({ queryKey: ["dashboard"], queryFn: async () => (await unwrap(api.GET("/admin/dashboard"))).data });
  return (
    <>
      <PageHeader
        title="Dashboard"
        sub="Ringkasan konten dan leads"
        actions={
          <>
            <Button href="/" variant="secondary" target="_blank">
              Lihat Situs
            </Button>
            <Button href="/admin/artikel/baru">Tulis Artikel</Button>
          </>
        }
      />
      {q.isPending ? <Loading /> : null}
      {q.isError ? <ErrorBox message={q.error.message} /> : null}
      {q.data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [q.data.counts.newLeads, "leads baru belum dihubungi", "/admin/leads"],
              [q.data.counts.draftContent, "konten masih draft", "/admin/artikel"],
              [q.data.counts.activePromos, "promo aktif", "/admin/promo"],
            ].map(([v, l, href]) => (
              <Link key={String(l)} href={String(href)} className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-6 hover:border-cyan">
                <span className="text-display text-ink">{v}</span>
                <span className="text-small text-ink-muted">{l}</span>
              </Link>
            ))}
          </div>
          <Panel
            title="Leads terbaru"
            actions={
              <Link href="/admin/leads" className="text-[14px] font-medium text-cyan-ink hover:underline">
                Lihat semua
              </Link>
            }
          >
            <Table>
              <thead>
                <tr>
                  <Th>Nama</Th>
                  <Th>Perusahaan</Th>
                  <Th>Layanan</Th>
                  <Th>Masuk</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {q.data.latestLeads.length === 0 ? <EmptyRow cols={5}>Belum ada leads.</EmptyRow> : null}
                {q.data.latestLeads.map((l) => (
                  <tr key={l.id}>
                    <Td className="font-medium text-ink">
                      <Link href={`/admin/leads?id=${l.id}`} className="hover:underline">
                        {l.name}
                      </Link>
                    </Td>
                    <Td>{l.company ?? "—"}</Td>
                    <Td>{l.serviceTitle ?? "—"}</Td>
                    <Td>{relativeDay(l.createdAt)}</Td>
                    <Td>
                      <StatusBadge status={l.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Panel>
          <Panel title="Draft terakhir">
            <Table>
              <thead>
                <tr>
                  <Th>Judul</Th>
                  <Th>Jenis</Th>
                  <Th>Diubah</Th>
                  <Th>Status</Th>
                  <Th>
                    <span className="sr-only">Aksi</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {q.data.recentDrafts.length === 0 ? <EmptyRow cols={5}>Tidak ada draft.</EmptyRow> : null}
                {q.data.recentDrafts.map((d) => (
                  <tr key={`${d.type}-${d.id}`}>
                    <Td className="font-medium text-ink">{d.title}</Td>
                    <Td>{TYPE[d.type]?.label ?? d.type}</Td>
                    <Td>{relativeDay(d.updatedAt)}</Td>
                    <Td>
                      <StatusBadge status="draft" />
                    </Td>
                    <Td>
                      <Link href={TYPE[d.type]?.href(d.id) ?? "/admin"} className="font-medium text-cyan-ink hover:underline">
                        Edit<span className="sr-only"> {d.title}</span>
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Panel>
        </>
      ) : null}
    </>
  );
}
