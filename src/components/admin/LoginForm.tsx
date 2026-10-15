"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { api, applyFieldErrors, errorMessage, unwrap } from "@/lib/api/browser";
import { meKey } from "./auth";
import { ErrorBox } from "./Page";

const schema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi.").email("Format email belum benar."),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});
type V = z.infer<typeof schema>;

function safeNext(next: string | null) {
  return next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const qc = useQueryClient();
  const [error, setErr] = useState<string | null>(null);
  const { register, handleSubmit, setError, formState } = useForm<V>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (v: V) => {
    setErr(null);
    try {
      const res = await unwrap(api.POST("/auth/login", { body: v }));
      qc.setQueryData(meKey, res.data);
      router.replace(safeNext(sp.get("next")));
    } catch (e) {
      if (!applyFieldErrors(e, setError as never)) setErr(errorMessage(e));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-full max-w-[400px] flex-col gap-5 rounded-lg border border-line bg-surface p-10">
      <Image src="/brand/lockup-horizontal-gray.png" alt="Mind2Screen" width={176} height={34} priority className="h-[34px] w-auto self-start" />
      <h1 className="text-title text-ink">Masuk ke CMS</h1>
      <Input label="Email" type="email" autoComplete="username" placeholder="nama@mindtoscreen.com" error={formState.errors.email?.message} {...register("email")} />
      <Input label="Kata sandi" type="password" autoComplete="current-password" error={formState.errors.password?.message} {...register("password")} />
      {error ? <ErrorBox message={error} /> : null}
      <Button type="submit" disabled={formState.isSubmitting} className="w-full">
        {formState.isSubmitting ? "Memproses" : "Masuk"}
      </Button>
      <p className="text-small text-ink-muted">Lupa kata sandi? Hubungi Admin untuk reset.</p>
    </form>
  );
}
