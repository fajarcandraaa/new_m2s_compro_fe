import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Button } from "@/components/ui/Button";

/** Sticky "Panel diskusi" (Figma Detail Layanan / Detail Studi Kasus). */
export function DiscussPanel({
  diskusiHref = "/diskusi",
  whatsappHref,
  title = "Diskusikan kebutuhan sistem Anda",
  body = "Sesi awal tanpa biaya untuk memetakan masalah dan menentukan model kerja yang cocok: BOS atau BOR.",
  eyebrow = "Mulai dari discovery",
}: {
  diskusiHref?: string;
  whatsappHref: string;
  title?: string;
  body?: string | null;
  eyebrow?: string;
}) {
  return (
    <aside aria-label="Diskusi kebutuhan" className="flex flex-col gap-4 rounded-lg border-2 border-cyan bg-surface p-6 lg:sticky lg:top-8 lg:p-8">
      <p className="text-tagline text-cyan-ink">{eyebrow}</p>
      <h2 className="text-title text-ink">{title}</h2>
      {body ? <p className="text-small text-ink-muted">{body}</p> : null}
      <Button href={diskusiHref} className="w-full">
        Diskusi Kebutuhan Sistem
      </Button>
      <WhatsAppButton href={whatsappHref} source="discuss-panel" className="w-full">
        Chat via WhatsApp
      </WhatsAppButton>
    </aside>
  );
}
