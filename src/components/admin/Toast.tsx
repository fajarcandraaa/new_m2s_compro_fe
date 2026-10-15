"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/cn";

type Toast = { id: number; kind: "success" | "error"; text: string };
const Ctx = createContext<{ success: (t?: string) => void; error: (t: string) => void } | null>(null);

/** Text-only toasts: "Tersimpan" or the API error message. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, kind, text }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), kind === "error" ? 6000 : 3000);
  }, []);
  const api = { success: (t = "Tersimpan") => push("success", t), error: (t: string) => push("error", t) };
  return (
    <Ctx.Provider value={api}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed right-6 bottom-6 z-[100] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto max-w-[420px] rounded-md border px-4 py-3 text-[14px] leading-[22px] font-medium",
              t.kind === "success" ? "border-ink bg-ink text-surface" : "border-[#f1c0bb] bg-[#fdf3f2] text-[#b42318]",
            )}
          >
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast outside ToastProvider");
  return c;
}
