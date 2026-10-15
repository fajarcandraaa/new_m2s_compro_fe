"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-sm border border-line bg-surface px-4 py-2 text-body text-ink placeholder:text-ink-muted " +
  "focus:border-cyan focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-cyan focus-visible:rounded-sm " +
  "disabled:opacity-40 aria-[invalid=true]:border-[#c0392b]";

type FieldShellProps = {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

function FieldShell({ id, label, hint, error, optional, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[14px] leading-[22px] font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-ink-muted"> (opsional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-small text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-small text-[#b42318]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: React.ReactNode, error?: string) {
  return [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
}

type Common = { label: React.ReactNode; hint?: React.ReactNode; error?: string; optional?: boolean; wrapperClassName?: string };

export const Input = forwardRef<HTMLInputElement, Common & React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { label, hint, error, optional, wrapperClassName, id, className, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} hint={hint} error={error} optional={optional} className={wrapperClassName}>
      <input
        ref={ref}
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fid, hint, error)}
        className={cn(control, className)}
        {...rest}
      />
    </FieldShell>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { label, hint, error, optional, wrapperClassName, id, className, rows = 4, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} hint={hint} error={error} optional={optional} className={wrapperClassName}>
      <textarea
        ref={ref}
        id={fid}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fid, hint, error)}
        className={cn(control, "min-h-[128px] resize-y", className)}
        {...rest}
      />
    </FieldShell>
  );
});

/** Select: native <select> styled per Figma, with the text affordance "Pilih" (no icon set). */
export const Select = forwardRef<HTMLSelectElement, Common & React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { label, hint, error, optional, wrapperClassName, id, className, children, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} hint={hint} error={error} optional={optional} className={wrapperClassName}>
      <div className="relative">
        <select
          ref={ref}
          id={fid}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fid, hint, error)}
          className={cn(control, "appearance-none pr-16", className)}
          {...rest}
        >
          {children}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[14px] leading-[22px] font-medium text-cyan-ink">
          Pilih
        </span>
      </div>
    </FieldShell>
  );
});
