/**
 * Generated Open Graph images (next/og, 1200×630): dark brand ground, cyan glow, two slanted
 * brand screens, white lockup, eyebrow, title and domain. Used by the opengraph-image files.
 * Assets are read from disk relative to the app root; next.config.ts traces the fonts into the
 * standalone output (public/ is copied next to it by the Dockerfile).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND_SCREEN_PATH } from "@/components/brand/BrandScreen";
import { SITE_URL } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const assets = {
  medium: "src/assets/fonts/Poppins-Medium.ttf",
  semibold: "src/assets/fonts/Poppins-SemiBold.ttf",
  lockup: "public/brand/lockup-horizontal-white.png",
};

/** Missing assets degrade (default font / text wordmark) instead of failing the image. */
async function load(path: string): Promise<Buffer | null> {
  try {
    return await readFile(join(process.cwd(), path));
  } catch (err) {
    console.warn(`[og] asset unavailable (${path}): ${(err as Error).message}`);
    return null;
  }
}

/** Keep titles to ~3 lines: shrink the type for long titles, then cut at a word boundary. */
function fitTitle(title: string): { text: string; size: number } {
  const t = title.trim().replace(/\s+/g, " ");
  const size = t.length <= 40 ? 68 : t.length <= 64 ? 58 : 50;
  const max = 84;
  if (t.length <= max) return { text: t, size };
  const cut = t.slice(0, max);
  return { text: `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 60)).replace(/[\s,.;:–-]+$/, "")}…`, size };
}

const screenSvg = (id: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 520"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#30c2db"/><stop offset="1" stop-color="#43f4fa"/></linearGradient></defs><path d="${BRAND_SCREEN_PATH}" fill="url(#${id})"/></svg>`,
  )}`;

export async function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [medium, semibold, lockup] = await Promise.all([load(assets.medium), load(assets.semibold), load(assets.lockup)]);
  const fonts = [
    ...(medium ? [{ name: "Poppins", data: medium, weight: 500 as const, style: "normal" as const }] : []),
    ...(semibold ? [{ name: "Poppins", data: semibold, weight: 600 as const, style: "normal" as const }] : []),
  ];
  const { text, size } = fitTitle(title);
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#080808",
          backgroundImage: "radial-gradient(circle at 88% 18%, rgba(48,194,219,0.32) 0%, rgba(8,8,8,0) 55%)",
          ...(fonts.length ? { fontFamily: "Poppins" } : {}),
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={screenSvg("a")} width={150} height={390} alt="" style={{ position: "absolute", top: 150, right: 150 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={screenSvg("b")} width={190} height={494} alt="" style={{ position: "absolute", top: 70, right: -50 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: "64px 72px" }}>
          {lockup ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`data:image/png;base64,${lockup.toString("base64")}`} width={247} height={44} alt="Mind2Screen" />
          ) : (
            <div style={{ fontSize: 36, fontWeight: 600 }}>Mind2Screen</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
            <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#30c2db" }}>{eyebrow}</div>
            <div style={{ marginTop: 20, fontSize: size, lineHeight: 1.15, fontWeight: 600 }}>{text}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 500, color: "#a3a3a3" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#30c2db", marginRight: 16 }} />
            {host}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
