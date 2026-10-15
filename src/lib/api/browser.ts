"use client";
/**
 * Browser API client: same-origin `/api/v1` through the Next.js rewrite.
 * Always sends the CSRF header `X-Requested-With: m2s-cms` and the session cookie.
 */
import createClient from "openapi-fetch";
import type { paths } from "./schema";
import type { ApiError, ErrorCode } from "./types";

export const CSRF_HEADER = { "X-Requested-With": "m2s-cms" } as const;

export const api = createClient<paths>({
  baseUrl: "/api/v1",
  credentials: "include",
  headers: CSRF_HEADER,
});

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: ErrorCode | "network_error" | "unknown";
  readonly fields: Record<string, string>;
  constructor(status: number, body: ApiError | undefined, fallback = "Terjadi kesalahan. Coba lagi.") {
    super(body?.error?.message || fallback);
    this.status = status;
    this.code = body?.error?.code ?? "unknown";
    this.fields = body?.error?.fields ?? {};
  }
}

/** Unwrap an openapi-fetch result: return `data` or throw ApiRequestError. */
export async function unwrap<T>(call: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  let res: { data?: T; error?: unknown; response: Response };
  try {
    res = await call;
  } catch {
    throw new ApiRequestError(0, undefined, "Tidak dapat terhubung ke server. Periksa koneksi Anda.");
  }
  if (res.error !== undefined || !res.response.ok) {
    const body = (typeof res.error === "object" ? res.error : undefined) as ApiError | undefined;
    if (res.response.status === 429) {
      throw new ApiRequestError(429, body, "Terlalu banyak permintaan. Coba lagi sebentar lagi.");
    }
    throw new ApiRequestError(res.response.status, body);
  }
  return res.data as T;
}

type SetError = (name: never, error: { type: string; message: string }, options?: { shouldFocus?: boolean }) => void;

/**
 * Map `error.fields` dot paths (e.g. `packages.0.priceValue`, `seo.title`) onto react-hook-form.
 * The contract guarantees the keys equal RHF paths. Returns true when at least one field was set.
 * `rename` lets a form map an API path onto a differently named form field.
 */
export function applyFieldErrors(
  err: unknown,
  setError: SetError,
  rename: Record<string, string> | ((path: string) => string) = {},
): boolean {
  if (!(err instanceof ApiRequestError)) return false;
  const entries = Object.entries(err.fields);
  const seen = new Set<string>();
  entries.forEach(([path, message]) => {
    const name = typeof rename === "function" ? rename(path) : (rename[path] ?? path);
    if (seen.has(name)) return;
    setError(name as never, { type: "server", message }, { shouldFocus: seen.size === 0 });
    seen.add(name);
  });
  return entries.length > 0;
}

/**
 * For forms that edit string arrays as "one item per line" textareas: map
 * `points.2` / `packages.0.features.1` onto the textarea field (`points`, `packages.0.features`).
 */
export function collapseIndexedPath(arrayFields: string[]) {
  return (path: string) => {
    for (const f of arrayFields) {
      const re = new RegExp(`^(${f.replace(/\./g, "\\.").replace(/\*/g, "\\d+")})\\.\\d+$`);
      const m = path.match(re);
      if (m) return m[1]!;
    }
    return path;
  };
}

export function errorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) return err.message;
  if (err instanceof Error) return err.message;
  return "Terjadi kesalahan. Coba lagi.";
}
