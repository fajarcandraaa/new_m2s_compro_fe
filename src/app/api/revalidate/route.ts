import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /api/revalidate — called by the BE after admin mutations.
 * Header `X-Revalidate-Secret` must equal REVALIDATE_SECRET.
 * Body `{ "tags": ["articles", ...] }`. The special tag `*` revalidates every page
 * (useful right after a deploy whose build ran without a reachable BE).
 */
const KNOWN = new Set(["site", "services", "case-studies", "articles", "promos", "testimonials", "client-logos"]);

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("x-revalidate-secret") ?? "";
  if (!secret || !safeEqual(given, secret)) {
    return NextResponse.json({ error: { code: "unauthorized", message: "Invalid revalidate secret." } }, { status: 401 });
  }
  let tags: unknown;
  try {
    tags = ((await req.json()) as { tags?: unknown }).tags;
  } catch {
    return NextResponse.json({ error: { code: "bad_request", message: "Invalid JSON body." } }, { status: 400 });
  }
  if (!Array.isArray(tags) || tags.length === 0 || !tags.every((t) => typeof t === "string" && t.length <= 64)) {
    return NextResponse.json({ error: { code: "bad_request", message: "Body must be { tags: string[] }." } }, { status: 400 });
  }
  const done: string[] = [];
  for (const tag of tags as string[]) {
    if (tag === "*") {
      revalidatePath("/", "layout");
      KNOWN.forEach((t) => revalidateTag(t));
      done.push("*");
    } else {
      revalidateTag(tag);
      done.push(tag);
    }
  }
  return NextResponse.json({ data: { revalidated: done, now: Date.now() } });
}
