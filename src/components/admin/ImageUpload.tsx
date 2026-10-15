"use client";

import { useId, useRef, useState } from "react";
import { errorMessage } from "@/lib/api/browser";
import { cn } from "@/lib/cn";
import { ACCEPT, uploadMedia } from "./media";

/** Dropzone "Seret gambar ke sini" → uploads via /admin/media and returns the URL. */
export function ImageUpload({
  value,
  onChange,
  label,
  hint = "JPG/PNG/WebP, maks. 2 MB",
  error,
  aspect = "aspect-video",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  hint?: string;
  error?: string;
  aspect?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const handle = async (file: File | undefined) => {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const m = await uploadMedia(file);
      onChange(m.url);
    } catch (e) {
      setErr(errorMessage(e));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-[14px] leading-[22px] font-medium text-ink">
        {label}
      </span>
      {value ? (
        <div className="flex flex-col gap-2">
          {/* Uploaded media preview (same-origin /uploads); plain img keeps the CMS independent of the image optimizer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className={cn("w-full rounded-md border border-line object-cover", aspect)} />
          <div className="flex gap-4">
            <button type="button" className="text-[14px] font-medium text-cyan-ink hover:underline" onClick={() => input.current?.click()} disabled={busy}>
              {busy ? "Mengunggah" : "Ganti gambar"}
            </button>
            <button type="button" className="text-[14px] font-medium text-ink-muted hover:underline" onClick={() => onChange(null)}>
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void handle(e.dataTransfer.files[0]);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-md border border-dashed px-4 py-7 text-center",
            drag ? "border-cyan bg-ground" : "border-line",
          )}
        >
          <span className="text-[14px] leading-[22px] text-ink">{busy ? "Mengunggah" : "Seret gambar ke sini atau pilih file"}</span>
          <span id={`${id}-hint`} className="text-small text-ink-muted">
            {hint}
          </span>
        </button>
      )}
      <input ref={input} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => void handle(e.target.files?.[0])} />
      {err || error ? (
        <p role="alert" className="text-small text-[#b42318]">
          {err ?? error}
        </p>
      ) : null}
    </div>
  );
}
