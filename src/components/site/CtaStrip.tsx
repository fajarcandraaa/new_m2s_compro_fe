import { Button } from "@/components/ui/Button";

/** Light CTA panel: title + body + primary button (Figma "Punya situasi yang mirip?" / Layanan CTA). */
export function CtaStrip({ title, body, href = "/diskusi", label = "Diskusi Kebutuhan Sistem" }: { title: string; body: string; href?: string; label?: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-title text-ink">{title}</h2>
        <p className="text-body text-ink-muted">{body}</p>
      </div>
      <Button href={href} className="shrink-0">
        {label}
      </Button>
    </div>
  );
}
