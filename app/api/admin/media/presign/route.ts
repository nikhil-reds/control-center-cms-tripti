import { randomUUID } from "node:crypto";
import { getPresignedUploadUrl } from "@/lib/s3";
import { getMediaType, validateMediaFile } from "@/lib/media-validation";

export const runtime = "nodejs";

function safeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(-120) || "media";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fileName?: unknown;
      contentType?: unknown;
      sizeBytes?: unknown;
    };
    if (typeof body.fileName !== "string" || typeof body.contentType !== "string" || typeof body.sizeBytes !== "number") {
      return Response.json({ error: "Invalid upload request." }, { status: 400 });
    }

    const validationError = validateMediaFile(body.contentType, body.sizeBytes);
    const mediaType = getMediaType(body.contentType);
    if (validationError || !mediaType) {
      return Response.json({ error: validationError ?? "Unsupported media type." }, { status: 400 });
    }

    const key = `media/${new Date().getUTCFullYear()}/${randomUUID()}-${safeFileName(body.fileName)}`;
    const uploadUrl = await getPresignedUploadUrl(key, body.contentType);
    return Response.json({ uploadUrl, key, mediaType });
  } catch (error) {
    console.error("Unable to prepare S3 upload", error);
    return Response.json({ error: "Unable to prepare upload." }, { status: 500 });
  }
}
