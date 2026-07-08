import { prisma } from "@/lib/prisma";
import { getMediaType, validateMediaFile } from "@/lib/media-validation";
import { getObjectUrl } from "@/lib/s3";

export const runtime = "nodejs";

function optionalPositiveInteger(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (
      typeof body.key !== "string" || !body.key.startsWith("media/") ||
      typeof body.name !== "string" || !body.name.trim() ||
      typeof body.originalName !== "string" ||
      typeof body.mimeType !== "string" ||
      typeof body.sizeBytes !== "number"
    ) {
      return Response.json({ error: "Invalid media details." }, { status: 400 });
    }

    const validationError = validateMediaFile(body.mimeType, body.sizeBytes);
    const type = getMediaType(body.mimeType);
    if (validationError || !type) {
      return Response.json({ error: validationError ?? "Unsupported media type." }, { status: 400 });
    }

    const media = await prisma.media.create({
      data: {
        name: body.name.trim().slice(0, 100),
        type,
        status: "ONLINE",
        objectKey: body.key,
        originalName: body.originalName.slice(0, 255),
        mimeType: body.mimeType,
        sourceUrl: getObjectUrl(body.key),
        thumbnailUrl: type === "IMAGE" ? getObjectUrl(body.key) : null,
        sizeBytes: BigInt(body.sizeBytes),
        width: optionalPositiveInteger(body.width),
        height: optionalPositiveInteger(body.height),
        durationSeconds: type === "VIDEO" ? optionalPositiveInteger(body.durationSeconds) : null,
      },
      select: { id: true },
    });

    return Response.json(media, { status: 201 });
  } catch (error) {
    console.error("Unable to save uploaded media", error);
    return Response.json({ error: "The file uploaded, but its media record could not be saved." }, { status: 500 });
  }
}
