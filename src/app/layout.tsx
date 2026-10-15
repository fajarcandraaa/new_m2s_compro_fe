import type { Metadata, Viewport } from "next";
import { poppins } from "@/lib/fonts";
import { DEFAULT_DESCRIPTION, DEFAULT_OG } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Mind2Screen | Partner Sistem Internal B2B", template: "%s | Mind2Screen" },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Mind2Screen",
  openGraph: { siteName: "Mind2Screen", locale: "id_ID", type: "website", images: [{ url: DEFAULT_OG, width: 1200, height: 630 }] },
  icons: {
    icon: [{ url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" }, { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
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
