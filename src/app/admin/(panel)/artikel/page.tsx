"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { EmptyRow, ErrorBox, Loading, PageHeader, Table, Td, Th } from "@/components/admin/Page";
import { Pager } from "@/components/admin/Pager";
import { useDebounced } from "@/components/admin/useDebounced";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api, unwrap } from "@/lib/api/browser";
import { formatDate } from "@/lib/format";

type Status = "" | "draft" | "published" | "scheduled";
const PAGE_SIZE = 20;

export default function ArtikelListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status>("");
  const [page, setPage] = useState(1);
  const dq = useDebounced(q.trim());

  const list = useQuery({
    queryKey: ["admin-articles", dq, status, page],
    queryFn: async () =>
      unwrap(
        api.GET("/admin/articles", {
          params: { query: { page, pageSize: PAGE_SIZE, ...(dq ? { q: dq } : {}), ...(status ? { status } : {}) } },
        }),
      ),
    placeholderData: keepPreviousData,
  });
  const counts = useQuery({
    queryKey: ["admin-articles-counts"],
    queryFn: async () => {
      const [p, d] = await Promise.all([
        unwrap(api.GET("/admin/articles", { params: { query: { pageSize: 1, status: "published" } } })),
        unwrap(api.GET("/admin/articles", { params: { query: { pageSize: 1, status: "draft" } } })),
      ]);
      return { published: p.meta.total, draft: d.meta.total };
    },
  });

  return (
    <>
      <PageHeader
        title="Artikel"
        sub={counts.data ? `${counts.data.published} terbit · ${counts.data.draft} draft` : " "}
        actions={<Button href="/admin/artikel/baru">Tulis Artikel</Button>}
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <Input
          label="Cari"
          type="search"
          placeholder="Cari judul artikel"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as Status);
            setPage(1);
          }}
        >
          <option value="">Semua status</option>
          <option value="published">Terbit</option>
          <option value="scheduled">Terjadwal</option>
          <option value="draft">Draft</option>
        </Select>
      </div>
      {list.isError ? <ErrorBox message={list.error.message} /> : null}
      <Table>
        <thead>
          <tr>
            <Th>Judul</Th>
            <Th>Tag</Th>
            <Th>Tanggal</Th>
            <Th>Status</Th>
            <Th>
              <span className="sr-only">Aksi</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {list.isPending ? (
            <EmptyRow cols={5}>
              <Loading />
            </EmptyRow>
          ) : null}
          {list.data && list.data.data.length === 0 ? <EmptyRow cols={5}>Tidak ada artikel yang cocok.</EmptyRow> : null}
          {list.data?.data.map((a) => (
            <tr key={a.id}>
              <Td className="max-w-[420px] font-medium text-ink">{a.title}</Td>
              <Td>{a.tags[0]?.name ?? "—"}</Td>
              <Td className="whitespace-nowrap">{a.publishedAt ? formatDate(a.publishedAt) : "—"}</Td>
              <Td>
                <StatusBadge status={a.isScheduled ? "scheduled" : a.status} />
              </Td>
              <Td>
                <Link href={`/admin/artikel/${a.id}`} className="font-medium text-cyan-ink hover:underline">
                  Edit<span className="sr-only"> {a.title}</span>
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {list.data ? <Pager page={page} pageSize={PAGE_SIZE} total={list.data.meta.total} onPage={setPage} /> : null}
    </>
  );
}
