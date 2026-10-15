"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/** CMS/Toggle: switch 44×24, always paired with a text label. */
export function Toggle({
  checked,
  onChange,
  label,
  help,
  disabled,
  hideLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  help?: string;
  disabled?: boolean;
  hideLabel?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-label={hideLabel ? label : undefined}
        aria-describedby={help ? `${id}-help` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-[1px] inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors disabled:opacity-40",
          checked ? "border-cyan bg-cyan" : "border-line bg-ground",
        )}
      >
        <span
          aria-hidden="true"
          className={cn("block h-[18px] w-[18px] rounded-full bg-surface transition-transform", checked ? "translate-x-[22px]" : "translate-x-[2px] border border-line")}
        />
      </button>
      {hideLabel ? null : (
        <label htmlFor={id} className="flex flex-col">
          <span className="text-[14px] leading-[22px] font-medium text-ink">{label}</span>
          {help ? (
            <span id={`${id}-help`} className="text-small text-ink-muted">
              {help}
            </span>
          ) : null}
        </label>
      )}
    </div>
  );
}
