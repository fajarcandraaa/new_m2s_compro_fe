import type { Metadata, Viewport } from "next";
import { poppins } from "@/lib/fonts";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Mind2Screen | Partner Sistem Internal B2B", template: "%s | Mind2Screen" },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Mind2Screen",
  // og:image comes from app/opengraph-image.tsx (file convention); pages set their own via pageMetadata.
  openGraph: { siteName: "Mind2Screen", locale: "id_ID", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#080808",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
