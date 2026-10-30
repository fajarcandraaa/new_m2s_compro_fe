"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { api, applyFieldErrors, errorMessage, unwrap } from "@/lib/api/browser";
import type { LeadCreateInput } from "@/lib/api/types";

export const TIMEFRAMES = ["Secepatnya", "1–3 bulan lagi", "3–6 bulan lagi", "Lebih dari 6 bulan", "Belum tahu"];

// Mirrors LeadCreateInput constraints from the contract; the BE stays the source of truth.
const schema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(120, "Maksimal 120 karakter."),
  company: z.string().trim().max(160, "Maksimal 160 karakter."),
  email: z.string().trim().min(1, "Email wajib diisi.").max(254).email("Format email belum benar."),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp terlalu pendek.")
    .max(25, "Nomor WhatsApp terlalu panjang.")
    .regex(/^\+?[0-9][0-9 ()-]{6,23}[0-9]$/, "Gunakan format nomor seperti 0812-3456-7890."),
  service: z.string(),
  startTimeframe: z.string().max(100),
  message: z.string().trim().min(10, "Ceritakan minimal 10 karakter.").max(3000, "Maksimal 3000 karakter."),
  website: z.string().max(200),
});
type Values = z.infer<typeof schema>;

type ServiceOption = { slug: string; title: string };

export function DiskusiForm({
  services,
  whatsappHref,
  defaultService,
  defaultMessage,
}: {
  services: ServiceOption[];
  whatsappHref: string;
  defaultService?: string;
  defaultMessage?: string;
}) {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      whatsapp: "",
      service: defaultService && services.some((s) => s.slug === defaultService) ? defaultService : "",
      startTimeframe: "",
      message: defaultMessage ?? "",
      website: "",
    },
  });

  const onSubmit = async (v: Values) => {
    setFormError(null);
    const body: LeadCreateInput = {
      name: v.name,
      company: v.company || null,
      email: v.email,
      whatsapp: v.whatsapp,
      service: v.service || null,
      startTimeframe: v.startTimeframe || null,
      message: v.message,
      website: v.website,
    };
    try {
      // Posted from the browser through the same-origin /api rewrite (rate limit keys on client IP).
      await unwrap(api.POST("/leads", { body }));
      sendGAEvent("event", "generate_lead", { form: "diskusi", service: v.service || "none" });
      setSent(true);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (err) {
      if (!applyFieldErrors(err, setError as never)) setFormError(errorMessage(err));
      else setFormError("Periksa kembali isian yang ditandai.");
    }
  };

  if (sent) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 rounded-lg border-2 border-cyan bg-surface p-6 outline-none lg:p-12"
      >
        <p className="text-tagline text-cyan-ink">Brief terkirim</p>
        <h2 className="text-heading text-ink">Terima kasih, Kami sudah menerima brief Anda</h2>
        <p className="text-body text-ink-muted">
          Tim Kami akan menghubungi Anda lewat email atau WhatsApp untuk menjadwalkan sesi diskusi. Jika mendesak, Anda bisa langsung chat
          Kami.
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-4">
          <WhatsAppButton href={whatsappHref} source="diskusi-success">
            Chat via WhatsApp
          </WhatsAppButton>
          <Button href="/studi-kasus" variant="secondary">
            Lihat Studi Kasus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="brief-title"
      className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-6 lg:p-10"
    >
      <h2 id="brief-title" className="text-title text-ink">
        Brief kebutuhan
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Input label="Nama lengkap" placeholder="Nama Anda" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Input
          label="Nama perusahaan"
          optional
          placeholder="Contoh: PT Maju Bersama"
          autoComplete="organization"
          error={errors.company?.message}
          {...register("company")}
        />
        <Input
          label="Email kerja"
          type="email"
          placeholder="nama@perusahaan.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Nomor WhatsApp"
          type="tel"
          inputMode="tel"
          placeholder="08xx xxxx xxxx"
          autoComplete="tel"
          error={errors.whatsapp?.message}
          {...register("whatsapp")}
        />
        <Select label="Layanan yang dibutuhkan" optional error={errors.service?.message} {...register("service")}>
          <option value="">Pilih layanan</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </Select>
        <Select label="Perkiraan mulai" optional error={errors.startTimeframe?.message} {...register("startTimeframe")}>
          <option value="">Pilih waktu</option>
          {TIMEFRAMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>
      <Textarea
        label="Ceritakan kebutuhan Anda"
        rows={4}
        placeholder="Contoh: approval cuti masih lewat WhatsApp dan sering terlewat, data karyawan tersebar di beberapa spreadsheet."
        error={errors.message?.message}
        {...register("message")}
      />
      {/* Honeypot: visually hidden and skipped by keyboard/assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      {formError ? (
        <p role="alert" className="rounded-sm border border-[#f1c0bb] bg-[#fdf3f2] px-4 py-2 text-small text-[#b42318]">
          {formError}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Mengirim" : "Kirim Brief"}
        </Button>
        <p className="text-small text-ink-muted">Dengan mengirim, Anda setuju data ini dipakai untuk menghubungi Anda terkait brief ini.</p>
      </div>
    </form>
  );
}

/** Reads ?layanan= and ?paket= on the client so /diskusi stays statically rendered (ISR). */
export function DiskusiFormWithParams(props: { services: ServiceOption[]; whatsappHref: string }) {
  const sp = useSearchParams();
  const layanan = sp.get("layanan") ?? undefined;
  const paket = sp.get("paket")?.slice(0, 60);
  return (
    <DiskusiForm
      key={`${layanan ?? ""}|${paket ?? ""}`}
      {...props}
      defaultService={layanan}
      defaultMessage={paket ? `Saya tertarik dengan paket ${paket}. ` : undefined}
    />
  );
}
