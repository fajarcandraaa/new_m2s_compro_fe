/**
 * Server-side API access (Server Components, generateMetadata, sitemap).
 * Calls the BE directly via BACKEND_URL and tags every fetch for on-demand
 * revalidation (POST /api/revalidate) with a 300 s ISR fallback.
 *
 * Build-time resilience: `next build` may run without a reachable BE (Docker build).
 * During the build phase a failed request resolves to `null` and pages render their
 * empty/fallback state; the result is ISR-cached with revalidate 300 and the cache tags
 * are already attached, so the page is regenerated at runtime (after 300 s or as soon as
 * the BE fires a revalidation / an operator calls /api/revalidate). At runtime a failed
 * request THROWS, so ISR keeps serving the last good page instead of caching an empty one.
 */
import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:8080").replace(/\/$/, "");
export const REVALIDATE_SECONDS = 300;

const isBuildPhase = () => process.env.NEXT_PHASE === "phase-production-build";

export const serverClient = createClient<paths>({ baseUrl: `${BACKEND_URL}/api/v1` });

/** Per-request fetch that carries Next's cache options (openapi-fetch passes a Request). */
export function tagged(tags: string[]) {
  return (req: Request) => fetch(req, { next: { tags, revalidate: REVALIDATE_SECONDS } });
}

type Result<T> = { data?: T; error?: unknown; response: Response };

export class ApiUnavailableError extends Error {}

/**
 * Await an openapi-fetch call. Returns the parsed body, `null` on 404,
 * `null` on any failure during the build phase, and throws otherwise.
 */
export async function settle<T>(call: Promise<Result<T>>): Promise<T | null> {
  try {
    const { data, error, response } = await call;
    if (response.status === 404) return null;
    if (error !== undefined || data === undefined) {
      throw new ApiUnavailableError(`API ${response.url} responded ${response.status}`);
    }
    return data;
  } catch (err) {
    if (isBuildPhase()) {
      console.warn(`[api] build-time fetch failed, rendering fallback: ${(err as Error).message}`);
      return null;
    }
    throw err;
  }
}
