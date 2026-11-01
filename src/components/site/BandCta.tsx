import { cn } from "@/lib/cn";

/**
 * Section ajakan di atas pita gradient cyan (mockup `.band`).
 * Dua shape dekoratif ikut bergeser saat hover.
 */
export function BandCta({
  id,
  eyebrow,
  title,
  body,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "group relative overflow-hidden bg-[linear-gradient(135deg,#30c2db,#43f4fa)] text-[#080808]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -top-[30px] -right-10 h-[340px] w-[260px] bg-white/20 [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)] transition-transform duration-500 group-hover:-translate-y-3"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-[90px] right-[240px] hidden h-[260px] w-[200px] bg-white/20 [clip-path:polygon(0_20%,100%_0,100%_80%,0_100%)] transition-transform duration-500 group-hover:-translate-y-3 lg:block"
      />
      <div className="container-narrow relative z-10 grid gap-8 py-14 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-8 lg:py-[72px]">
        <div className="flex flex-col gap-4">
          {eyebrow ? <p className="text-tagline text-[#080808]">{eyebrow}</p> : null}
          <h2 id={id} className="text-heading">
            {title}
          </h2>
          {body ? <p className="max-w-[560px] text-body">{body}</p> : null}
        </div>
        {children ? <div className="flex flex-wrap items-start gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
