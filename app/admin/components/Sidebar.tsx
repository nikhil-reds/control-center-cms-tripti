"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../admin.module.css";
import { GridIcon, MediaIcon, ZapIcon } from "./Icons";

const links = [
  { href: "/admin", label: "Dashboard", icon: GridIcon },
  { href: "/admin/media", label: "Media library", icon: MediaIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  return <aside className={styles.sidebar}>
    <div className={styles.brand}><div className={styles.brandMark}><ZapIcon /></div><div className={styles.brandName}>Rubenius<span>Control centre</span></div></div>
    <p className={styles.navLabel}>Workspace</p>
    <nav className={styles.nav} aria-label="Admin navigation">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}><Icon />{label}</Link>;
      })}
    </nav>
    <div className={styles.sidebarBottom}>
      <div className={styles.systemCard}><div className={styles.systemLine}><span><i className={styles.onlineDot}/>System</span><strong>Operational</strong></div></div>
      <div className={styles.profile}><div className={styles.avatar}>NK</div><div className={styles.profileText}>Nikhil Kumar<span>Administrator</span></div></div>
    </div>
  </aside>;
}
