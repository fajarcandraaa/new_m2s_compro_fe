"use client";

import { useId, useState } from "react";

/** Ordered multi-tag input (first tag = primary/category). Enter or comma adds; suggestions via datalist. */
export function TagInput({
  value,
  onChange,
  suggestions = [],
  label = "Tag",
  error,
  max = 10,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  suggestions?: string[];
  label?: string;
  error?: string;
  max?: number;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const t = raw.trim().slice(0, 60);
    if (!t || value.length >= max) return;
    if (value.some((v) => v.toLowerCase() === t.toLowerCase())) return;
    onChange([...value, t]);
    setDraft("");
  };
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[14px] leading-[22px] font-medium text-ink">
        {label}
      </label>
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Tag terpilih">
          {value.map((t, i) => (
            <li key={t} className="inline-flex items-center gap-2 rounded-sm border border-line bg-ground px-2 py-1 text-small text-ink">
              {i === 0 ? <span className="text-[11px] font-medium tracking-[0.12em] text-cyan-ink uppercase">Utama</span> : null}
              {t}
              {i > 0 ? (
                <button type="button" onClick={() => move(i, -1)} className="text-[12px] text-cyan-ink" aria-label={`Naikkan ${t}`}>
                  Naik
                </button>
              ) : null}
              <button type="button" onClick={() => remove(i)} className="text-[12px] text-ink-muted hover:text-ink" aria-label={`Hapus ${t}`}>
                Hapus
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <input
        id={id}
        list={`${id}-list`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
          }
        }}
        onBlur={() => add(draft)}
        placeholder={value.length >= max ? `Maksimal ${max} tag` : "Ketik tag lalu tekan Enter"}
        disabled={value.length >= max}
        aria-invalid={error ? true : undefined}
        className="w-full rounded-sm border border-line bg-surface px-4 py-2 text-body text-ink placeholder:text-ink-muted focus:border-cyan"
      />
      <datalist id={`${id}-list`}>
        {suggestions
          .filter((s) => !value.includes(s))
          .map((s) => (
            <option key={s} value={s} />
          ))}
      </datalist>
      {error ? (
        <p role="alert" className="text-small text-[#b42318]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
