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
export function applyFieldErrors(err: unknown, setError: SetError, rename: Record<string, string> = {}): boolean {
  if (!(err instanceof ApiRequestError)) return false;
  const entries = Object.entries(err.fields);
  entries.forEach(([path, message], i) => {
    const name = (rename[path] ?? path) as never;
    setError(name, { type: "server", message }, { shouldFocus: i === 0 });
  });
  return entries.length > 0;
}

export function errorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) return err.message;
  if (err instanceof Error) return err.message;
  return "Terjadi kesalahan. Coba lagi.";
}
