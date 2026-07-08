import { prisma } from "@/lib/prisma";
import { getPresignedDownloadUrl } from "@/lib/s3";
import { MediaManager, type MediaView } from "./MediaManager";
import styles from "../admin.module.css";

function formatFileSize(bytes: bigint) {
  const value = Number(bytes) / 1024 / 1024;
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} MB`;
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export default async function MediaPage() {
  let media: MediaView[] = [];
  let loadError: string | undefined;
  try {
    const records = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
    media = await Promise.all(records.map(async (item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      status: item.status,
      mimeType: item.mimeType,
      sizeLabel: formatFileSize(item.sizeBytes),
      durationLabel: formatDuration(item.durationSeconds),
      viewUrl: item.status === "ONLINE" ? await getPresignedDownloadUrl(item.objectKey) : null,
      createdLabel: new Intl.DateTimeFormat("en", { day: "2-digit", month: "short" }).format(item.createdAt),
    })));
  } catch (error) {
    console.error("Unable to load media library", error);
    loadError = "The media database is temporarily unavailable. Uploads will be available once the connection is restored.";
  }

  return <main className={styles.content}><MediaManager initialMedia={media} loadError={loadError}/></main>;
}
