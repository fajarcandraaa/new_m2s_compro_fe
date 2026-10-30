import type { NextConfig } from "next";

const backendUrl = (process.env.BACKEND_URL ?? "http://localhost:8080").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Brand fonts read by the generated OG images (src/lib/og.tsx) must ship with the standalone server.
  outputFileTracingIncludes: { "/**/opengraph-image*": ["./src/assets/fonts/*.ttf"] },
  images: {
    // Uploaded media is served same-origin through the /uploads rewrite.
    localPatterns: [{ pathname: "/uploads/**" }, { pathname: "/brand/**" }],
  },
  async headers() {
    // Baseline hardening. No CSP yet: inline JSON-LD and the Tiptap editor need testing with one first.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Frame-Options", value: "DENY" }] },
    ];
  },
  async rewrites() {
    return [
      // Route handlers under app/api (e.g. /api/revalidate) win over this afterFiles rewrite.
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
      { source: "/uploads/:path*", destination: `${backendUrl}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
