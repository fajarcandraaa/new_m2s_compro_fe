"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiRequestError, unwrap } from "@/lib/api/browser";
import { cn } from "@/lib/cn";
import { useMeQuery, UserProvider } from "./auth";
import { ErrorBox, Loading } from "./Page";

type Item = { href: string; label: string; adminOnly?: boolean };
const GROUPS: Array<{ label: string; items: Item[]; adminOnly?: boolean }> = [
  {
    label: "Konten",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/artikel", label: "Artikel" },
      { href: "/admin/layanan", label: "Layanan" },
      { href: "/admin/studi-kasus", label: "Studi Kasus" },
      { href: "/admin/promo", label: "Promo" },
      { href: "/admin/testimoni", label: "Testimoni" },
    ],
  },
  { label: "Bisnis", items: [{ href: "/admin/leads", label: "Leads" }] },
  {
    label: "Pengaturan",
    adminOnly: true,
    items: [
      { href: "/admin/info-perusahaan", label: "Info Perusahaan", adminOnly: true },
      { href: "/admin/pengguna", label: "Pengguna", adminOnly: true },
    ],
  },
];

/** CMS shell: auth gate (GET /auth/me), role-gated sidebar (CMS/Sidebar), main area. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const me = useMeQuery();
  const pathname = usePathname();
  const router = useRouter();
  const qc = useQueryClient();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => setNavOpen(false), [pathname]);

  const logout = useMutation({
    mutationFn: async () => unwrap(api.POST("/auth/logout")),
    onSettled: () => {
      qc.clear();
      router.replace("/admin/login");
    },
  });

  if (me.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading label="Memeriksa sesi" />
      </div>
    );
  }
  if (me.isError) {
    if (me.error instanceof ApiRequestError && me.error.status === 401) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loading label="Mengalihkan ke halaman masuk" />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-[560px] p-8">
        <ErrorBox message={me.error.message} />
      </div>
    );
  }

  const user = me.data;
  const isAdmin = user.role === "admin";
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));

  const sidebar = (
    <nav aria-label="Menu CMS" className="flex h-full flex-col gap-1 px-4 py-6">
      <Link href="/admin" className="mb-6 flex items-center gap-[10px] pl-4">
        <Image src="/brand/mark-gradient.png" alt="" width={28} height={28} />
        <span className="text-[14px] leading-[22px] font-semibold text-ink">Mind2Screen CMS</span>
      </Link>
      {GROUPS.filter((g) => !g.adminOnly || isAdmin).map((g) => (
        <div key={g.label} className="mt-3 flex flex-col gap-1 first:mt-0">
          <p className="pb-[6px] pl-4 text-[11px] leading-[20px] font-medium tracking-[0.12em] text-ink-muted uppercase">{g.label}</p>
          <ul className="flex flex-col gap-1">
            {g.items
              .filter((i) => !i.adminOnly || isAdmin)
              .map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    aria-current={active(i.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-4 py-[10px] text-[14px] leading-[22px]",
                      active(i.href) ? "border-l-2 border-cyan bg-ground font-medium text-ink" : "text-ink-muted hover:bg-ground hover:text-ink",
                    )}
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
      <div className="mt-auto flex flex-col gap-[2px] border-t border-line pt-4 pl-4 text-[14px] leading-[22px]">
        <span className="font-medium text-ink">{user.name}</span>
        <span className="text-ink-muted">
          {isAdmin ? "Admin" : "Editor"} ·{" "}
          <button type="button" onClick={() => logout.mutate()} className="hover:text-ink hover:underline" disabled={logout.isPending}>
            Keluar
          </button>
        </span>
      </div>
    </nav>
  );

  return (
    <UserProvider value={user}>
      <div className="min-h-screen bg-ground lg:flex">
        <a href="#cms-main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-cyan focus:px-4 focus:py-2">
          Lewati ke konten
        </a>
        <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 overflow-y-auto border-r border-line bg-surface lg:block">{sidebar}</aside>
        <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
          <span className="text-[14px] font-semibold">Mind2Screen CMS</span>
          <button type="button" aria-expanded={navOpen} aria-controls="cms-nav" onClick={() => setNavOpen((v) => !v)} className="text-[14px] font-medium">
            {navOpen ? "Tutup" : "Menu"}
          </button>
        </div>
        {navOpen ? (
          <div id="cms-nav" className="border-b border-line bg-surface lg:hidden">
            {sidebar}
          </div>
        ) : null}
        <main id="cms-main" className="min-w-0 flex-1 px-4 py-6 lg:px-10 lg:py-8">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-6">{children}</div>
        </main>
      </div>
    </UserProvider>
  );
}
