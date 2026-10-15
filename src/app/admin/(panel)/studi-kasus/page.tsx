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
import { relativeDay } from "@/lib/dates";

const PAGE_SIZE = 20;

export default function StudiKasusListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | "draft" | "published">("");
  const [page, setPage] = useState(1);
  const dq = useDebounced(q.trim());
  const list = useQuery({
    queryKey: ["admin-case-studies", dq, status, page],
    queryFn: async () =>
      unwrap(api.GET("/admin/case-studies", { params: { query: { page, pageSize: PAGE_SIZE, ...(dq ? { q: dq } : {}), ...(status ? { status } : {}) } } })),
    placeholderData: keepPreviousData,
  });
  return (
    <>
      <PageHeader title="Studi Kasus" sub="Maks. 2 studi kasus tampil di Beranda" actions={<Button href="/admin/studi-kasus/baru">Tambah Studi Kasus</Button>} />
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <Input label="Cari" type="search" placeholder="Cari judul atau sistem" value={q} onChange={(e) => (setQ(e.target.value), setPage(1))} />
        <Select label="Status" value={status} onChange={(e) => (setStatus(e.target.value as typeof status), setPage(1))}>
          <option value="">Semua status</option>
          <option value="published">Terbit</option>
          <option value="draft">Draft</option>
        </Select>
      </div>
      {list.isError ? <ErrorBox message={list.error.message} /> : null}
      <Table>
        <thead>
          <tr>
            <Th>Judul</Th>
            <Th>Sistem · Kategori</Th>
            <Th>Beranda</Th>
            <Th>Diubah</Th>
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
          {list.data?.data.length === 0 ? <EmptyRow cols={6}>Belum ada studi kasus.</EmptyRow> : null}
          {list.data?.data.map((c) => (
            <tr key={c.id}>
              <Td className="max-w-[380px] font-medium text-ink">{c.title}</Td>
              <Td>
                {c.systemName} · {c.category}
              </Td>
              <Td>{c.featured ? "Ya" : "Tidak"}</Td>
              <Td>{relativeDay(c.updatedAt)}</Td>
              <Td>
                <StatusBadge status={c.status} />
              </Td>
              <Td>
                <Link href={`/admin/studi-kasus/${c.id}`} className="font-medium text-cyan-ink hover:underline">
                  Edit<span className="sr-only"> {c.title}</span>
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
