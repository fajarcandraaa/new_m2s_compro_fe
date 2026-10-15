"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { api, unwrap } from "@/lib/api/browser";
import type { User } from "@/lib/api/types";

export const meKey = ["me"] as const;

export function useMeQuery() {
  return useQuery({ queryKey: meKey, queryFn: async () => (await unwrap(api.GET("/auth/me"))).data, staleTime: 60_000 });
}

const UserCtx = createContext<User | null>(null);
export const UserProvider = UserCtx.Provider;

export function useUser(): User {
  const u = useContext(UserCtx);
  if (!u) throw new Error("useUser outside the admin shell");
  return u;
}

export function useIsAdmin() {
  return useUser().role === "admin";
}

/** Renders children only for admins; editors get an explanation (they also never see the menu entry). */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) {
    return (
      <div className="rounded-lg border border-line bg-surface p-6">
        <h1 className="text-title text-ink">Halaman ini hanya untuk Admin</h1>
        <p className="mt-2 text-small text-ink-muted">Hubungi Admin jika Anda perlu mengubah pengaturan ini.</p>
      </div>
    );
  }
  return <>{children}</>;
}
