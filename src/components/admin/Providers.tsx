"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ApiRequestError } from "@/lib/api/browser";
import { ConfirmProvider } from "./Dialog";
import { ToastProvider } from "./Toast";

function onAuthError(err: unknown) {
  if (err instanceof ApiRequestError && err.status === 401 && typeof window !== "undefined") {
    const next = window.location.pathname + window.location.search;
    if (!window.location.pathname.startsWith("/admin/login")) {
      window.location.assign(`/admin/login?next=${encodeURIComponent(next)}`);
    }
  }
}

export function AdminProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: onAuthError }),
        mutationCache: new MutationCache({ onError: onAuthError }),
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
            retry: (count, err) => !(err instanceof ApiRequestError && err.status > 0 && err.status < 500) && count < 2,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
