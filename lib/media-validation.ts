import type { MediaType } from "@/lib/generated/prisma/enums";

export const MAX_MEDIA_SIZE = 500 * 1024 * 1024;
export const ACCEPTED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
] as const;

export function getMediaType(mimeType: string): MediaType | null {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  return null;
}

export function validateMediaFile(contentType: string, sizeBytes: number) {
  if (!ACCEPTED_MEDIA_TYPES.includes(contentType as (typeof ACCEPTED_MEDIA_TYPES)[number])) {
    return "Use a JPG, PNG, WebP, MP4, or WebM file.";
  }
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return "The selected file is empty.";
  if (sizeBytes > MAX_MEDIA_SIZE) return "Files must be smaller than 500 MB.";
  return null;
}
