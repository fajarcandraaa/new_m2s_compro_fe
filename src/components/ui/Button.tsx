import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 " +
  "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

const variants: Record<Variant, string> = {
  primary: "bg-cyan text-on-cyan border border-cyan hover:bg-cyan-glow hover:border-cyan-glow",
  secondary: "bg-surface text-ink border border-line hover:border-cyan",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-4 text-[16px] leading-[26px]",
  sm: "px-4 py-2 text-[14px] leading-[22px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

type ButtonAsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; disabled?: boolean };

/** Button (Figma "Button"): Primary/Secondary, md/sm, disabled, or rendered as a link when `href` is set. */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  if (props.href !== undefined) {
    const { variant, size, className, children, href, disabled, ...rest } = props;
    const cls = buttonClass(variant, size, className);
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          aria-disabled={disabled || undefined}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-disabled={disabled || undefined} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, size, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
