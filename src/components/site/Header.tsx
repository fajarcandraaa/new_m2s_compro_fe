"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Header (Figma "Header"): horizontal lockup, text nav, one Primary button.
 * Rendered inside a dark scope on every public page (all page heroes are dark).
 * Mobile: text button "Menu" opens a keyboard-usable drawer.
 * The ID / EN toggle exists in Figma but is intentionally hidden (no i18n yet).
 */
export function Header({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = drawer.current;
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const logo = theme === "dark" ? "/brand/lockup-horizontal-white.png" : "/brand/lockup-horizontal-gray.png";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header data-theme={theme} className="relative z-20 border-b border-line bg-ground">
      <div className="mx-auto flex h-[62px] max-w-[1440px] items-center justify-between px-4 lg:h-[91px] lg:px-20">
        <Link href="/" aria-label="Mind2Screen, ke beranda" className="relative block h-[30px] w-[168px] shrink-0 lg:h-10 lg:w-[208px]">
          <Image src={logo} alt="Mind2Screen" fill priority sizes="208px" className="object-contain object-left" />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "text-[14px] leading-[22px] font-medium text-ink transition-colors hover:text-cyan-ink",
                    isActive(item.href) && "text-cyan-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {/* Placeholder keeps the Figma layout; the ID/EN toggle ships with i18n later. */}
          <span aria-hidden="true" className="invisible text-small">
            ID / EN
          </span>
          <Button href="/diskusi">Diskusi Kebutuhan Sistem</Button>
        </div>

        <button
          ref={menuButton}
          type="button"
          className="text-[14px] leading-[22px] font-medium text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          ref={drawer}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-theme="dark"
          className="fixed inset-0 z-50 flex flex-col bg-ground lg:hidden"
        >
          <div className="flex h-[62px] items-center justify-between border-b border-line px-4">
            <Link href="/" onClick={close} className="relative block h-[30px] w-[168px]" aria-label="Mind2Screen, ke beranda">
              <Image src="/brand/lockup-horizontal-white.png" alt="Mind2Screen" fill sizes="168px" className="object-contain object-left" />
            </Link>
            <button type="button" onClick={close} className="text-[14px] leading-[22px] font-medium text-ink">
              Tutup
            </button>
          </div>
          <nav aria-label="Navigasi utama" className="flex-1 overflow-y-auto px-4 py-8">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn("block py-4 text-title text-ink", isActive(item.href) && "text-cyan-ink")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="border-b border-line">
                <Link href="/promo" onClick={() => setOpen(false)} className="block py-4 text-title text-ink">
                  Promo
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4">
            <Button href="/diskusi" className="w-full" onClick={() => setOpen(false)}>
              Diskusi Kebutuhan Sistem
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
