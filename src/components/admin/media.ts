"use client";

import { ApiRequestError, CSRF_HEADER } from "@/lib/api/browser";
import type { ApiError, MediaUpload } from "@/lib/api/types";

export const MAX_UPLOAD = 2 * 1024 * 1024;
export const ACCEPT = "image/jpeg,image/png,image/webp";

/** POST /api/v1/admin/media (multipart field `file`). Validates type/size client-side first. */
export async function uploadMedia(file: File): Promise<MediaUpload> {
  if (!ACCEPT.split(",").includes(file.type)) throw new ApiRequestError(415, undefined, "Format harus JPG, PNG, atau WebP.");
  if (file.size > MAX_UPLOAD) throw new ApiRequestError(413, undefined, "Ukuran gambar maksimal 2 MB.");
  const fd = new FormData();
  fd.append("file", file);
  let res: Response;
  try {
    res = await fetch("/api/v1/admin/media", { method: "POST", body: fd, credentials: "include", headers: CSRF_HEADER });
  } catch {
    throw new ApiRequestError(0, undefined, "Tidak dapat terhubung ke server.");
  }
  const body = (await res.json().catch(() => undefined)) as { data: MediaUpload } | ApiError | undefined;
  if (!res.ok || !body || !("data" in body)) throw new ApiRequestError(res.status, body as ApiError | undefined, "Gagal mengunggah gambar.");
  return body.data;
}
