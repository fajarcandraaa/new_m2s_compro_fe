"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminOnly } from "@/components/admin/auth";
import { ErrorBox, Loading, PageHeader, Panel } from "@/components/admin/Page";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { api, applyFieldErrors, errorMessage, unwrap } from "@/lib/api/browser";
import type { SettingsAdmin, SettingsInput } from "@/lib/api/types";

const url = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Gunakan alamat lengkap yang diawali https://");
const schema = z.object({
  companyName: z.string().trim().min(1, "Wajib diisi.").max(120),
  legalName: z.string().trim().min(1, "Wajib diisi.").max(160),
  tagline: z.string().max(160),
  email: z.string().trim().min(1, "Wajib diisi.").max(254).email("Format email belum benar."),
  whatsappNumber: z
    .string()
    .trim()
    .min(8, "Nomor terlalu pendek.")
    .max(25)
    .regex(/^\+?[0-9][0-9 ()-]{6,23}[0-9]$/, "Gunakan format nomor seperti +62 822-3010-9923."),
  whatsappDisplay: z.string().max(32),
  whatsappGreeting: z.string().max(300),
  address: z.string().max(300),
  mapsUrl: url,
  linkedinUrl: url,
  instagramUrl: url,
});
type V = z.infer<typeof schema>;

const toForm = (s: SettingsAdmin): V => ({
  companyName: s.companyName,
  legalName: s.legalName,
  tagline: s.tagline,
  email: s.email,
  whatsappNumber: s.whatsappNumber,
  whatsappDisplay: s.whatsappDisplay,
  whatsappGreeting: s.whatsappGreeting,
  address: s.address,
  mapsUrl: s.mapsUrl ?? "",
  linkedinUrl: s.linkedinUrl ?? "",
  instagramUrl: s.instagramUrl ?? "",
});

function InfoForm() {
  const qc = useQueryClient();
  const toast = useToast();
  const [formError, setFormError] = useState<string | null>(null);
  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: async () => (await unwrap(api.GET("/admin/settings"))).data });
  const { register, handleSubmit, reset, setError, formState } = useForm<V>({ resolver: zodResolver(schema) });
  useEffect(() => {
    if (settings.data) reset(toForm(settings.data));
  }, [settings.data, reset]);
  const save = useMutation({
    mutationFn: async (v: V) => {
      const body: SettingsInput = { ...v, mapsUrl: v.mapsUrl || null, linkedinUrl: v.linkedinUrl || null, instagramUrl: v.instagramUrl || null };
      return (await unwrap(api.PUT("/admin/settings", { body }))).data;
    },
    onSuccess: (s) => {
      qc.setQueryData(["admin-settings"], s);
      reset(toForm(s));
      toast.success();
    },
    onError: (e) => {
      const mapped = applyFieldErrors(e, setError as never);
      setFormError(mapped ? "Periksa kembali isian yang ditandai." : errorMessage(e));
      toast.error(errorMessage(e));
    },
  });
  if (settings.isPending) return <Loading />;
  if (settings.isError) return <ErrorBox message={settings.error.message} />;
  const e = formState.errors;
  return (
    <form noValidate onSubmit={handleSubmit((v) => (setFormError(null), save.mutate(v)))} className="flex flex-col gap-6">
      <PageHeader
        title="Info perusahaan"
        sub="Dipakai di footer, halaman kontak, tombol WhatsApp, dan data SEO"
        actions={
          <Button type="submit" disabled={save.isPending}>
            Simpan Perubahan
          </Button>
        }
      />
      {formError ? <ErrorBox message={formError} /> : null}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel title="Kontak">
          <Input label="Nama perusahaan" error={e.companyName?.message} {...register("companyName")} />
          <Input label="Nama legal" error={e.legalName?.message} {...register("legalName")} />
          <Input label="Tagline" error={e.tagline?.message} {...register("tagline")} />
          <Input label="Email" type="email" error={e.email?.message} {...register("email")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nomor WhatsApp" hint="Disimpan dalam format +62." error={e.whatsappNumber?.message} {...register("whatsappNumber")} />
            <Input label="Tampilan nomor" placeholder="+62 822-3010-9923" error={e.whatsappDisplay?.message} {...register("whatsappDisplay")} />
          </div>
          <Textarea label="Pesan pembuka WhatsApp" rows={3} error={e.whatsappGreeting?.message} {...register("whatsappGreeting")} />
        </Panel>
        <Panel title="Alamat & tautan">
          <Textarea label="Alamat kantor" rows={3} error={e.address?.message} {...register("address")} />
          <Input label="Tautan Google Maps" optional placeholder="https://maps.google.com/..." error={e.mapsUrl?.message} {...register("mapsUrl")} />
          <Input label="LinkedIn" optional placeholder="https://linkedin.com/company/..." error={e.linkedinUrl?.message} {...register("linkedinUrl")} />
          <Input label="Instagram" optional placeholder="https://instagram.com/..." error={e.instagramUrl?.message} {...register("instagramUrl")} />
        </Panel>
      </div>
    </form>
  );
}

export default function InfoPerusahaanPage() {
  return (
    <AdminOnly>
      <InfoForm />
    </AdminOnly>
  );
}
