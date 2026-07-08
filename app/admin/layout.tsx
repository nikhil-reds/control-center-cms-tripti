import type { Metadata } from "next";
import styles from "./admin.module.css";
import { Sidebar } from "./components/Sidebar";
import { BellIcon, SearchIcon } from "./components/Icons";

export const metadata: Metadata = { title: "Admin | Rubenius Control Centre" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.shell}>
    <Sidebar />
    <div className={styles.main}>
      <header className={styles.topbar}>
        <div className={styles.breadcrumb}>Control centre <strong>/ Admin</strong></div>
        <div className={styles.topActions}>
          <label className={styles.search}><SearchIcon width={14}/><input type="search" placeholder="Search anything…" aria-label="Search" /></label>
          <button className={styles.iconButton} aria-label="Notifications"><BellIcon width={15}/></button>
        </div>
      </header>
      {children}
    </div>
  </div>;
}
