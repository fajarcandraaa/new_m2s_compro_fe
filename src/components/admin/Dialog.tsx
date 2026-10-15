"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

/** Accessible modal built on <dialog> (focus trap + Escape handled by the browser). */
export function Dialog({
  open,
  onClose,
  title,
  children,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="dialog-title"
      style={{ maxWidth: `min(${width}px, calc(100vw - 32px))` }}
      className="m-auto w-full rounded-lg border border-line bg-surface p-0 text-ink backdrop:bg-[rgba(8,8,8,0.4)]"
    >
      {open ? (
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="dialog-title" className="text-title text-ink">
              {title}
            </h2>
            <button type="button" onClick={onClose} className="text-[14px] font-medium text-ink-muted hover:text-ink">
              Tutup
            </button>
          </div>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}

type ConfirmOpts = { title: string; body?: string; confirmLabel?: string };
const ConfirmCtx = createContext<((o: ConfirmOpts) => Promise<boolean>) | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<(ConfirmOpts & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((resolve) => setState({ ...o, resolve })), []);
  const done = (v: boolean) => {
    state?.resolve(v);
    setState(null);
  };
  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <Dialog open={state !== null} onClose={() => done(false)} title={state?.title ?? ""} width={440}>
        {state?.body ? <p className="text-small text-ink-muted">{state.body}</p> : null}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => done(false)}>
            Batal
          </Button>
          <Button size="sm" onClick={() => done(true)}>
            {state?.confirmLabel ?? "Ya, hapus"}
          </Button>
        </div>
      </Dialog>
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const c = useContext(ConfirmCtx);
  if (!c) throw new Error("useConfirm outside ConfirmProvider");
  return c;
}
