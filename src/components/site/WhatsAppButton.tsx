"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/Button";

/** Button that opens a WhatsApp link and fires a GA4 contact_whatsapp event. */
export function WhatsAppButton({
  href,
  source,
  children,
  className,
  variant = "secondary",
  size,
}: {
  href: string;
  /** Page/component that triggered the click, sent as event param. */
  source: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
}) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      onClick={() => sendGAEvent("event", "contact_whatsapp", { source })}
    >
      {children}
    </Button>
  );
}
