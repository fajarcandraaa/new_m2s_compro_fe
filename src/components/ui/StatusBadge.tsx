import { cn } from "@/lib/cn";

export type BadgeStatus = "active" | "upcoming" | "ended" | "draft" | "published" | "scheduled" | "new" | "contacted" | "done";

const LABEL: Record<BadgeStatus, string> = {
  active: "Aktif",
  upcoming: "Akan datang",
  ended: "Berakhir",
  draft: "Draft",
  published: "Terbit",
  scheduled: "Terjadwal",
  new: "Baru",
  contacted: "Dihubungi",
  done: "Selesai",
};

const STYLE: Record<BadgeStatus, string> = {
  active: "bg-surface border-cyan text-cyan-ink",
  published: "bg-surface border-cyan text-cyan-ink",
  upcoming: "bg-surface border-line text-ink",
  contacted: "bg-surface border-line text-ink",
  scheduled: "bg-surface border-line text-ink",
  ended: "bg-ground border-line text-ink-muted",
  draft: "bg-ground border-line text-ink-muted",
  done: "bg-ground border-line text-ink-muted",
  new: "bg-cyan border-cyan text-on-cyan",
};

/** Status Badge (Figma): text always present; colour is never the only signal. */
export function StatusBadge({ status, className }: { status: BadgeStatus; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 rounded-sm border px-2 py-1 text-[14px] leading-[22px] font-medium whitespace-nowrap", STYLE[status], className)}>
      {LABEL[status]}
    </span>
  );
}

export function statusLabel(status: BadgeStatus) {
  return LABEL[status];
}
