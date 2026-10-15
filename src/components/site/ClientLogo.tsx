import Image from "next/image";
import type { ClientLogo as L } from "@/lib/api/types";

/** Client Logo (Figma): 160×64 slot, monochrome ink-muted rendering of the CMS logo. */
export function ClientLogo({ logo }: { logo: L }) {
  return (
    <div className="relative flex h-16 w-[160px] shrink-0 items-center justify-center">
      <Image
        src={logo.imageUrl}
        alt={logo.name}
        fill
        sizes="160px"
        className="object-contain p-2 [filter:grayscale(1)_brightness(0)_invert(0.64)]"
      />
    </div>
  );
}
