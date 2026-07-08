import Link from "next/link";
import styles from "./admin.module.css";
import { ClockIcon, MediaIcon, PlayIcon, ScreenIcon, UploadIcon, ZapIcon } from "./components/Icons";

const stats = [
  { label: "Connected screens", value: "04", foot: "All screens online", icon: ScreenIcon },
  { label: "Media assets", value: "28", foot: "+6 this month", icon: MediaIcon },
  { label: "Currently playing", value: "03", foot: "Across 3 displays", icon: PlayIcon },
  { label: "Storage used", value: "68%", foot: "8.2 GB of 12 GB", icon: ClockIcon },
];
const screens = [
  ["Reception Display", "Main lobby · 4K", "Brand Film 2026", "Online"],
  ["Experience Wall", "Studio A · Ultra-wide", "Material Stories", "Online"],
  ["Meeting Room", "Boardroom · HD", "Rubenius Overview", "Online"],
  ["Gallery Screen", "Level 2 · 4K", "Project Showcase", "Online"],
];

export default function AdminDashboard() {
  return <main className={styles.content}>
    <div className={styles.pageHead}><div><p className={styles.eyebrow}>Wednesday, 08 July</p><h1>Good morning, Nikhil.</h1><p>Here&apos;s the pulse of your digital experience network today.</p></div><Link href="/admin/media" className={styles.primaryButton}><UploadIcon width={15}/>Add media</Link></div>
    <section className={styles.stats} aria-label="Overview">
      {stats.map(({ label, value, foot, icon: Icon }) => <article className={`${styles.card} ${styles.stat}`} key={label}><div className={styles.statTop}>{label}<span className={styles.statIcon}><Icon width={15}/></span></div><div className={styles.statValue}>{value}</div><div className={styles.statFoot}><span className={styles.positive}>●</span> {foot}</div></article>)}
    </section>
    <div className={styles.dashboardGrid}>
      <section className={styles.card}><div className={styles.panelHead}><h2>Screen activity</h2><Link className={styles.textLink} href="/control-center">Open control centre →</Link></div><div className={styles.screenList}>
        {screens.map(([name, location, playing, status]) => <div className={styles.screenRow} key={name}><div className={styles.screenName}><span className={styles.screenThumb}><ScreenIcon width={15}/></span><span>{name}<span className={styles.subtext}>{location}</span></span></div><span className={styles.playing}>{playing}</span><span className={styles.status}><i className={styles.onlineDot}/>{status}</span><span className={styles.more}>···</span></div>)}
      </div></section>
      <section className={styles.card}><div className={styles.panelHead}><h2>Recent activity</h2><span className={styles.textLink}>Today</span></div><div className={styles.activityList}>
        <div className={styles.activity}><span className={styles.activityIcon}><UploadIcon width={14}/></span><div><p><strong>Brand Film 2026</strong> was uploaded</p><time>12 minutes ago</time></div></div>
        <div className={styles.activity}><span className={styles.activityIcon}><PlayIcon width={14}/></span><div><p><strong>Material Stories</strong> started playing on Experience Wall</p><time>48 minutes ago</time></div></div>
        <div className={styles.activity}><span className={styles.activityIcon}><ZapIcon width={14}/></span><div><p><strong>Reception Display</strong> came online</p><time>2 hours ago</time></div></div>
        <div className={styles.activity}><span className={styles.activityIcon}><MediaIcon width={14}/></span><div><p><strong>Project Showcase</strong> was updated</p><time>Yesterday, 5:42 PM</time></div></div>
      </div></section>
    </div>
  </main>;
}
