import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./admin.module.css";
import { ClockIcon, MediaIcon, PlayIcon, ScreenIcon, UploadIcon } from "./components/Icons";

type DashboardDisplay = {
  id: string;
  name: string;
  location: string;
  resolution: string;
  status: "ONLINE" | "OFFLINE";
  activeMediaName: string | null;
};
type RecentMedia = { id: string; name: string; type: "IMAGE" | "VIDEO"; createdAt: Date };

function storageLabel(bytes: bigint) {
  const gigabytes = Number(bytes) / 1024 / 1024 / 1024;
  return gigabytes >= 1 ? `${gigabytes.toFixed(1)} GB` : `${Math.round(gigabytes * 1024)} MB`;
}

function relativeTime(date: Date) {
  const minutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short" }).format(date);
}

export default async function AdminDashboard() {
  let displayCount = 0;
  let onlineScreens = 0;
  let mediaCount = 0;
  let onlineMedia = 0;
  let playingCount = 0;
  let storageBytes = BigInt(0);
  let displays: DashboardDisplay[] = [];
  let recentMedia: RecentMedia[] = [];
  let loadError = false;

  try {
    const [allDisplayCount, onlineDisplayCount, allMediaCount, availableMediaCount, activeCount, storage, displayRows, mediaRows] = await Promise.all([
      prisma.display.count(),
      prisma.display.count({ where: { status: "ONLINE" } }),
      prisma.media.count(),
      prisma.media.count({ where: { status: "ONLINE" } }),
      prisma.display.count({ where: { activeMediaId: { not: null } } }),
      prisma.media.aggregate({ _sum: { sizeBytes: true } }),
      prisma.display.findMany({ include: { activeMedia: { select: { name: true } } }, orderBy: { name: "asc" }, take: 6 }),
      prisma.media.findMany({ select: { id: true, name: true, type: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    ]);
    displayCount = allDisplayCount;
    onlineScreens = onlineDisplayCount;
    mediaCount = allMediaCount;
    onlineMedia = availableMediaCount;
    playingCount = activeCount;
    storageBytes = storage._sum.sizeBytes ?? BigInt(0);
    displays = displayRows.map((display) => ({ ...display, activeMediaName: display.activeMedia?.name ?? null }));
    recentMedia = mediaRows;
  } catch (error) {
    console.error("Unable to load admin dashboard", error);
    loadError = true;
  }

  const stats = [
    { label: "Connected screens", value: onlineScreens.toString().padStart(2, "0"), foot: `${onlineScreens} online · ${displayCount - onlineScreens} offline`, icon: ScreenIcon },
    { label: "Media assets", value: mediaCount.toString().padStart(2, "0"), foot: `${onlineMedia} available`, icon: MediaIcon },
    { label: "Currently playing", value: playingCount.toString().padStart(2, "0"), foot: `Across ${playingCount} display${playingCount === 1 ? "" : "s"}`, icon: PlayIcon },
    { label: "Storage used", value: storageLabel(storageBytes), foot: "Stored securely on S3", icon: ClockIcon },
  ];

  const today = new Intl.DateTimeFormat("en", { weekday: "long", day: "2-digit", month: "long" }).format(new Date());
  return <main className={styles.content}>
    <div className={styles.pageHead}><div><p className={styles.eyebrow}>{today}</p><h1>gud morning</h1><p>Here&apos;s the pulse of your digital experience network today.</p></div><Link href="/admin/media" className={styles.primaryButton}><UploadIcon width={15}/>Add media</Link></div>
    {loadError && <div className={styles.errorBanner}>Live dashboard data is temporarily unavailable. Check the configured database connection.</div>}
    <section className={styles.stats} aria-label="Overview">
      {stats.map(({ label, value, foot, icon: Icon }) => <article className={`${styles.card} ${styles.stat}`} key={label}><div className={styles.statTop}>{label}<span className={styles.statIcon}><Icon width={15}/></span></div><div className={styles.statValue}>{value}</div><div className={styles.statFoot}><span className={styles.positive}>●</span> {foot}</div></article>)}
    </section>
    <div className={styles.dashboardGrid}>
      <section className={styles.card}><div className={styles.panelHead}><h2>Screen activity</h2><Link className={styles.textLink} href="/control-center">Open control centre →</Link></div>{displays.length ? <div className={styles.screenList}>
        {displays.map((display) => <div className={styles.screenRow} key={display.id}><div className={styles.screenName}><span className={styles.screenThumb}><ScreenIcon width={15}/></span><span>{display.name}<span className={styles.subtext}>{display.location} · {display.resolution}</span></span></div><span className={styles.playing}>{display.activeMediaName ?? "Nothing playing"}</span><span className={`${styles.status} ${display.status === "OFFLINE" ? styles.statusOffline : ""}`}><i className={display.status === "ONLINE" ? styles.onlineDot : styles.offlineDot}/>{display.status === "ONLINE" ? "Online" : "Offline"}</span><span className={styles.more}>···</span></div>)}
      </div> : <div className={styles.panelEmpty}>No displays have been added yet.</div>}</section>
      <section className={styles.card}><div className={styles.panelHead}><h2>Recent uploads</h2><Link href="/admin/media" className={styles.textLink}>View library</Link></div>{recentMedia.length ? <div className={styles.activityList}>
        {recentMedia.map((media) => <div className={styles.activity} key={media.id}><span className={styles.activityIcon}>{media.type === "VIDEO" ? <PlayIcon width={14}/> : <MediaIcon width={14}/>}</span><div><p><strong>{media.name}</strong> was uploaded</p><time>{relativeTime(media.createdAt)}</time></div></div>)}
      </div> : <div className={styles.panelEmpty}>Your latest uploads will appear here.</div>}</section>
    </div>
  </main>;
}
