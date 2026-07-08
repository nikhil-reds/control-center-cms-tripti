import { prisma } from "@/lib/prisma";
import { getStablePresignedDownloadUrl } from "@/lib/s3";
import {
  isPreviewMode,
  isSliderDirection,
  mediaControlState,
  setMode,
  type MediaRemoteState,
} from "@/lib/media-control";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

async function getOnlineVideo() {
  return prisma.media.findFirst({
    where: { type: "VIDEO", status: "ONLINE" },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, type: true, objectKey: true },
  });
}

async function getOnlineImages() {
  return prisma.media.findMany({
    where: { type: "IMAGE", status: "ONLINE" },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: { id: true, name: true, type: true, objectKey: true },
  });
}

async function resolveState(): Promise<MediaRemoteState> {
  if (mediaControlState.mode === "VIDEO") {
    const video = await getOnlineVideo();
    if (!video) {
      setMode("IDLE");
      return { ...mediaControlState, asset: null, slideTotal: 0 };
    }
    const signed = await getStablePresignedDownloadUrl(video.objectKey);
    return {
      ...mediaControlState,
      asset: { id: video.id, name: video.name, type: video.type, url: signed.url, urlExpiresAt: signed.expiresAt },
      slideTotal: 0,
    };
  }

  if (mediaControlState.mode === "SLIDER") {
    const images = await getOnlineImages();
    if (!images.length) {
      setMode("IDLE");
      return { ...mediaControlState, asset: null, slideTotal: 0 };
    }
    mediaControlState.slideIndex = Math.min(images.length - 1, Math.max(0, mediaControlState.slideIndex));
    const image = images[mediaControlState.slideIndex];
    const signed = await getStablePresignedDownloadUrl(image.objectKey);
    return {
      ...mediaControlState,
      asset: { id: image.id, name: image.name, type: image.type, url: signed.url, urlExpiresAt: signed.expiresAt },
      slideTotal: images.length,
    };
  }

  return { ...mediaControlState, asset: null, slideTotal: 0 };
}

export async function GET() {
  try {
    return json(await resolveState());
  } catch (error) {
    console.error("Unable to resolve media preview state", error);
    return json({ error: "Unable to load cloud media." }, 503);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    action?: unknown;
    mode?: unknown;
    playback?: unknown;
    direction?: unknown;
  } | null;

  if (!body) return json({ error: "Invalid media command." }, 400);

  try {
    if (body.action === "activate" && isPreviewMode(body.mode)) {
      const available = body.mode === "VIDEO" ? Boolean(await getOnlineVideo()) : (await getOnlineImages()).length > 0;
      if (!available) return json({ error: `No online ${body.mode === "VIDEO" ? "video" : "images"} available.` }, 409);
      setMode(body.mode);
      return json(await resolveState());
    }

    if (body.action === "deactivate") {
      setMode("IDLE");
      return json(await resolveState());
    }

    if (body.action === "playback" && mediaControlState.mode === "VIDEO" && (body.playback === "play" || body.playback === "pause")) {
      mediaControlState.videoPlaying = body.playback === "play";
      mediaControlState.updatedAt = Date.now();
      return json(await resolveState());
    }

    if (body.action === "navigate" && mediaControlState.mode === "SLIDER" && isSliderDirection(body.direction)) {
      const imageCount = await prisma.media.count({ where: { type: "IMAGE", status: "ONLINE" } });
      if (!imageCount) {
        setMode("IDLE");
        return json(await resolveState());
      }
      const delta = body.direction === "next" ? 1 : -1;
      mediaControlState.slideIndex = Math.min(imageCount - 1, Math.max(0, mediaControlState.slideIndex + delta));
      mediaControlState.updatedAt = Date.now();
      return json(await resolveState());
    }

    return json({ error: "Command is not valid for the active mode." }, 400);
  } catch (error) {
    console.error("Unable to process media command", error);
    return json({ error: "Unable to control cloud media." }, 503);
  }
}
