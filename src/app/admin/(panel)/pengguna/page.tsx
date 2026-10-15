"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminOnly, useUser } from "@/components/admin/auth";
import { Dialog, useConfirm } from "@/components/admin/Dialog";
import { EmptyRow, ErrorBox, Loading, PageHeader, Panel, Table, Td, TextLink, Th } from "@/components/admin/Page";
import { useToast } from "@/components/admin/Toast";
import { Toggle } from "@/components/admin/Toggle";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { api, applyFieldErrors, errorMessage, unwrap } from "@/lib/api/browser";
import type { User } from "@/lib/api/types";
import { relativeDay } from "@/lib/dates";

const password = z
  .string()
  .min(10, "Minimal 10 karakter.")
  .max(64, "Maksimal 64 karakter.")
  .refine((v) => new TextEncoder().encode(v).length <= 72, "Kata sandi terlalu panjang.");
const createSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(120),
  email: z.string().trim().min(1, "Email wajib diisi.").email("Format email belum benar.").max(254),
  role: z.enum(["admin", "editor"]),
  password,
});
const editSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(120),
  email: z.string().trim().min(1, "Email wajib diisi.").email("Format email belum benar.").max(254),
  role: z.enum(["admin", "editor"]),
  isActive: z.boolean(),
});
const resetSchema = z.object({ password });

type Mode = { kind: "create" } | { kind: "edit"; user: User } | { kind: "reset"; user: User } | null;

function CreateForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [err, setErr] = useState<string | null>(null);
  const f = useForm<z.infer<typeof createSchema>>({ resolver: zodResolver(createSchema), defaultValues: { name: "", email: "", role: "editor", password: "" } });
  const m = useMutation({
    mutationFn: async (body: z.infer<typeof createSchema>) => (await unwrap(api.POST("/admin/users", { body }))).data,
    onSuccess: () => {
      toast.success("Pengguna ditambahkan");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      onDone();
    },
    onError: (e) => setErr(applyFieldErrors(e, f.setError as never) ? "Periksa kembali isian yang ditandai." : errorMessage(e)),
  });
  const e = f.formState.errors;
  return (
    <form noValidate onSubmit={f.handleSubmit((v) => (setErr(null), m.mutate(v)))} className="flex flex-col gap-4">
      <Input label="Nama" error={e.name?.message} {...f.register("name")} />
      <Input label="Email" type="email" autoComplete="off" error={e.email?.message} {...f.register("email")} />
      <Select label="Peran" error={e.role?.message} {...f.register("role")}>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </Select>
      <Input label="Kata sandi awal" type="password" autoComplete="new-password" hint="10–64 karakter. Sampaikan ke pengguna secara aman." error={e.password?.message} {...f.register("password")} />
      {err ? <ErrorBox message={err} /> : null}
      <Button type="submit" size="sm" className="self-start" disabled={m.isPending}>
        Tambah Pengguna
      </Button>
    </form>
  );
}

function EditForm({ user, onDone }: { user: User; onDone: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [err, setErr] = useState<string | null>(null);
  const f = useForm<z.infer<typeof editSchema>>({ resolver: zodResolver(editSchema), defaultValues: { name: user.name, email: user.email, role: user.role, isActive: user.isActive } });
  const m = useMutation({
    mutationFn: async (body: z.infer<typeof editSchema>) => (await unwrap(api.PUT("/admin/users/{id}", { params: { path: { id: user.id } }, body }))).data,
    onSuccess: () => {
      toast.success();
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      onDone();
    },
    onError: (e) => setErr(applyFieldErrors(e, f.setError as never) ? "Periksa kembali isian yang ditandai." : errorMessage(e)),
  });
  const e = f.formState.errors;
  return (
    <form noValidate onSubmit={f.handleSubmit((v) => (setErr(null), m.mutate(v)))} className="flex flex-col gap-4">
      <Input label="Nama" error={e.name?.message} {...f.register("name")} />
      <Input label="Email" type="email" error={e.email?.message} {...f.register("email")} />
      <Select label="Peran" error={e.role?.message} {...f.register("role")}>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </Select>
      <Toggle checked={f.watch("isActive")} onChange={(v) => f.setValue("isActive", v)} label="Akun aktif" help="Pengguna nonaktif tidak bisa masuk ke CMS." />
      {e.isActive?.message ? <ErrorBox message={e.isActive.message} /> : null}
      {err ? <ErrorBox message={err} /> : null}
      <Button type="submit" size="sm" className="self-start" disabled={m.isPending}>
        Simpan
      </Button>
    </form>
  );
}

function ResetForm({ user, onDone }: { user: User; onDone: () => void }) {
  const toast = useToast();
  const [err, setErr] = useState<string | null>(null);
  const f = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema), defaultValues: { password: "" } });
  const m = useMutation({
    mutationFn: async (body: z.infer<typeof resetSchema>) => unwrap(api.POST("/admin/users/{id}/password", { params: { path: { id: user.id } }, body })),
    onSuccess: () => {
      toast.success("Kata sandi direset");
      onDone();
    },
    onError: (e) => setErr(applyFieldErrors(e, f.setError as never) ? "Periksa kembali isian yang ditandai." : errorMessage(e)),
  });
  return (
    <form noValidate onSubmit={f.handleSubmit((v) => (setErr(null), m.mutate(v)))} className="flex flex-col gap-4">
      <p className="text-small text-ink-muted">Kata sandi baru untuk {user.name}.</p>
      <Input label="Kata sandi baru" type="password" autoComplete="new-password" error={f.formState.errors.password?.message} {...f.register("password")} />
      {err ? <ErrorBox message={err} /> : null}
      <Button type="submit" size="sm" className="self-start" disabled={m.isPending}>
        Reset Kata Sandi
      </Button>
    </form>
  );
}

function UsersInner() {
  const me = useUser();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [mode, setMode] = useState<Mode>(null);
  const users = useQuery({ queryKey: ["admin-users"], queryFn: async () => (await unwrap(api.GET("/admin/users"))).data });
  const del = useMutation({
    mutationFn: async (id: string) => unwrap(api.DELETE("/admin/users/{id}", { params: { path: { id } } })),
    onSuccess: () => {
      toast.success("Pengguna dihapus");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  useEffect(() => {
    if (users.isError) toast.error(users.error.message);
  }, [users.isError, users.error, toast]);

  return (
    <>
      <PageHeader title="Pengguna" sub="Hanya Admin yang bisa membuka halaman ini" actions={<Button onClick={() => setMode({ kind: "create" })}>Tambah Pengguna</Button>} />
      <Table>
        <thead>
          <tr>
            <Th>Nama</Th>
            <Th>Email</Th>
            <Th>Peran</Th>
            <Th>Status</Th>
            <Th>Terakhir masuk</Th>
            <Th>
              <span className="sr-only">Aksi</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {users.isPending ? (
            <EmptyRow cols={6}>
              <Loading />
            </EmptyRow>
          ) : null}
          {users.data?.map((u) => {
            const self = u.id === me.id;
            return (
              <tr key={u.id}>
                <Td className="font-medium text-ink">
                  {u.name}
                  {self ? <span className="font-normal text-ink-muted"> (Anda)</span> : null}
                </Td>
                <Td>{u.email}</Td>
                <Td>{u.role === "admin" ? "Admin" : "Editor"}</Td>
                <Td>{u.isActive ? "Aktif" : "Nonaktif"}</Td>
                <Td>{u.lastLoginAt ? relativeDay(u.lastLoginAt) : "Belum pernah"}</Td>
                <Td>
                  {self ? (
                    <span className="text-small text-ink-muted">Tidak bisa mengubah akun sendiri</span>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <TextLink onClick={() => setMode({ kind: "edit", user: u })}>Edit</TextLink>
                      <TextLink onClick={() => setMode({ kind: "reset", user: u })}>Reset sandi</TextLink>
                      <TextLink
                        className="text-ink-muted"
                        onClick={async () => {
                          if (await confirm({ title: "Hapus pengguna?", body: `${u.name} tidak akan bisa masuk lagi. Untuk sementara, pertimbangkan menonaktifkan akun.` }))
                            del.mutate(u.id);
                        }}
                      >
                        Hapus
                      </TextLink>
                    </div>
                  )}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Panel title="Hak akses">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-[14px] font-medium text-ink">Admin</p>
            <p className="text-small text-ink-muted">Semua menu, termasuk Info Perusahaan, Pengguna, dan Leads.</p>
          </div>
          <div>
            <p className="text-[14px] font-medium text-ink">Editor</p>
            <p className="text-small text-ink-muted">
              Artikel, Layanan, Studi Kasus, Promo, dan Testimoni. Bisa membaca Leads. Tidak bisa mengubah Info Perusahaan dan Pengguna.
            </p>
          </div>
        </div>
      </Panel>
      <Dialog
        open={mode !== null}
        onClose={() => setMode(null)}
        title={mode?.kind === "create" ? "Tambah pengguna" : mode?.kind === "edit" ? "Edit pengguna" : "Reset kata sandi"}
      >
        {mode?.kind === "create" ? <CreateForm onDone={() => setMode(null)} /> : null}
        {mode?.kind === "edit" ? <EditForm user={mode.user} onDone={() => setMode(null)} /> : null}
        {mode?.kind === "reset" ? <ResetForm user={mode.user} onDone={() => setMode(null)} /> : null}
      </Dialog>
    </>
  );
}

export default function PenggunaPage() {
  return (
    <AdminOnly>
      <UsersInner />
    </AdminOnly>
  );
}
