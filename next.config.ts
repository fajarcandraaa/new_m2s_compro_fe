import type { NextConfig } from "next";

const backendUrl = (process.env.BACKEND_URL ?? "http://localhost:8080").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    // Uploaded media is served same-origin through the /uploads rewrite.
    localPatterns: [{ pathname: "/uploads/**" }, { pathname: "/brand/**" }],
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
