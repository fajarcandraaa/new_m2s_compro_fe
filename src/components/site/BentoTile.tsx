import { cn } from "@/lib/cn";

const VARIANTS = {
  hris: "b-hris row-span-2 col-span-2 min-h-[420px] border-transparent bg-[#080808] text-white [--muted:#a3a3a3] [--cyan-ink:#30c2db]",
  dms: "b-dms col-span-2 border-transparent bg-[linear-gradient(135deg,#30c2db,#43f4fa)] text-[#080808] [--muted:#080808] [--cyan-ink:#080808]",
  portal: "",
  custom: "border-dashed",
} as const;

/** Tile bento "Yang kami bangun" (mockup `.tile`): naik 6px dan border cyan saat hover. */
export function BentoTile({
  variant = "portal",
  className,
  children,
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-lg border border-line bg-surface p-8 transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-cyan",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </article>
  );
}
