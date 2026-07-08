import Image from "next/image";
import styles from "../admin.module.css";
import { UploadIcon } from "../components/Icons";

const items = [
  { name: "Brand Film 2026", meta: "MP4 · 184 MB", type: "Video", time: "02:14", src: "/button01/Dasra  NFSSM TDP__916 and 169 (1).jpg" },
  { name: "Material Stories", meta: "JPG · 4.8 MB", type: "Image", time: "", src: "/button03/3.jpg" },
  { name: "Project Showcase", meta: "JPG · 6.2 MB", type: "Image", time: "", src: "/button04/10.jpg" },
  { name: "Rubenius Overview", meta: "PDF · 12.4 MB", type: "PDF", time: "18 pages", src: "/button03/6.jpg" },
  { name: "Studio Atmosphere", meta: "MP4 · 96 MB", type: "Video", time: "01:08", src: "/button04/13.jpg" },
  { name: "Design Details", meta: "JPG · 5.1 MB", type: "Image", time: "", src: "/button03/8.jpg" },
];

export default function MediaPage() {
  return <main className={styles.content}>
    <div className={styles.pageHead}><div><p className={styles.eyebrow}>Content library</p><h1>Media</h1><p>Upload, organise, and prepare content for every connected display.</p></div><button className={styles.primaryButton}><UploadIcon width={15}/>Upload media</button></div>
    <div className={styles.mediaToolbar}><div className={styles.filters}><button className={`${styles.filter} ${styles.filterActive}`}>All media</button><button className={styles.filter}>Videos</button><button className={styles.filter}>Images</button><button className={styles.filter}>PDFs</button></div><div className={styles.libraryMeta}>28 items · 8.2 GB used</div></div>
    <section className={styles.mediaGrid} aria-label="Media library">
      {items.map(item => <article className={styles.mediaCard} key={item.name}><div className={styles.mediaPreview}><Image src={item.src} alt="" fill sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 33vw"/><span className={styles.mediaType}>{item.type}</span>{item.time && <span className={styles.duration}>{item.time}</span>}</div><div className={styles.mediaInfo}><div><h3>{item.name}</h3><p>{item.meta}</p></div><span className={styles.more}>···</span></div></article>)}
    </section>
  </main>;
}
