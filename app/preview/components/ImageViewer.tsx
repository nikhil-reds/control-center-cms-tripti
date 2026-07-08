"use client";
/* eslint-disable @next/next/no-img-element -- Private S3 assets use rotating signed URLs. */

import styles from "../preview.module.css";

export function ImageViewer({ src, name, index, total }: { src: string; name: string; index: number; total: number }) {
  return <section className={styles.imageViewer} aria-label={`${name}, image ${index + 1} of ${total}`}><div className={styles.imageSlide}><img src={src} alt={name} className={styles.sequenceImage}/></div><span className={styles.slideCounter}>{index + 1} / {total}</span></section>;
}
