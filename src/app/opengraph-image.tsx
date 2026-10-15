import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Mind2Screen | Partner Sistem Internal B2B";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({ eyebrow: "Partner Sistem Internal B2B", title: "HRIS, DMS, dan portal internal yang modular dan terdokumentasi" });
}
