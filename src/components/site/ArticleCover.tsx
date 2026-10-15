import Image from "next/image";
import { BrandScreen } from "@/components/brand/BrandScreen";
import { cn } from "@/lib/cn";

/** 16:9 cover; default (no image) = dark ground + two slanted screens on the right (Figma Article Card). */
export function ArticleCover({ src, alt, className, priority, sizes = "(min-width: 1024px) 400px, 100vw" }: { src: string | null; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <div data-theme="dark" className={cn("relative aspect-video w-full overflow-hidden rounded-lg bg-ground", className)}>
      {src ? (
        // Absolute URLs (allowed by the contract) bypass the optimiser: only /uploads and /brand are configured.
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={!src.startsWith("/")} className="object-cover" />
      ) : (
        <div aria-hidden="true">
          <BrandScreen className="absolute top-[17.8%] right-[7.5%] h-[138.7%] w-[30%]" />
          <BrandScreen className="absolute top-[-8.9%] right-[-17.5%] h-[161.8%] w-[35%]" />
        </div>
      )}
    </div>
  );
}
