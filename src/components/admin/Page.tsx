import { cn } from "@/lib/cn";

/** CMS page header: title + subtitle on the left, actions on the right. */
export function PageHeader({ title, sub, actions }: { title: string; sub?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-heading text-ink">{title}</h1>
        {sub ? <p className="text-small text-ink-muted">{sub}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function Panel({ title, children, className, actions }: { title?: string; children: React.ReactNode; className?: string; actions?: React.ReactNode }) {
  return (
    <section className={cn("flex flex-col gap-4 rounded-lg border border-line bg-surface p-6", className)}>
      {title || actions ? (
        <div className="flex items-center justify-between gap-4">
          {title ? <h2 className="text-title text-ink">{title}</h2> : <span />}
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Table shell matching the CMS frames (ground header row, line separators, radius-lg). */
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-line bg-surface", className)}>
      <table className="w-full border-collapse text-left text-[14px] leading-[22px]">{children}</table>
    </div>
  );
}
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th scope="col" className={cn("bg-ground px-6 py-3 font-normal whitespace-nowrap text-ink-muted", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-t border-line px-6 py-4 align-middle text-ink-muted", className)}>{children}</td>;
}

export function EmptyRow({ cols, children }: { cols: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={cols} className="border-t border-line px-6 py-8 text-center text-small text-ink-muted">
        {children}
      </td>
    </tr>
  );
}

export function TextLink({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn("text-[14px] leading-[22px] font-medium text-cyan-ink hover:underline disabled:opacity-40", className)} {...rest}>
      {children}
    </button>
  );
}

export function Loading({ label = "Memuat" }: { label?: string }) {
  return (
    <p role="status" className="text-small text-ink-muted">
      {label}
    </p>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-md border border-[#f1c0bb] bg-[#fdf3f2] px-4 py-3 text-small text-[#b42318]">
      {message}
    </p>
  );
}
